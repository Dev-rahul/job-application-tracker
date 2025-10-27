import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function POST(request: Request) {
  let browser;
  try {
    const { url } = await request.json();
    console.log('Extracting data from URL:', url);

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes('linkedin.com')) {
        return NextResponse.json(
          { error: 'Please provide a valid LinkedIn job URL' },
          { status: 400 }
        );
      }
    } catch (_: unknown) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Launch browser with debugging options
    console.log('Initializing browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      bypassCSP: true // Bypass Content Security Policy
    });
    const page = await context.newPage();

    try {
      console.log('Navigating to URL...');
      
      // Implement retry logic for navigation
      let navigationSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!navigationSuccess && retryCount < maxRetries) {
        try {
          // Use a less strict wait condition
          await page.goto(url, { 
            waitUntil: 'domcontentloaded',
            timeout: 20000 
          });

          // Wait for either the network to be idle or a timeout
          await Promise.race([
            page.waitForLoadState('networkidle', { timeout: 10000 }),
            page.waitForTimeout(15000)
          ]).catch(() => {
            console.log('Network idle timeout reached, continuing anyway...');
          });

          navigationSuccess = true;
        } catch {
          retryCount++;
          console.log(`Navigation attempt ${retryCount} failed`);
          
          if (retryCount === maxRetries) {
            throw new Error(`Failed to load the page after ${maxRetries} attempts. The page might be taking too long to respond or LinkedIn might be rate limiting requests.`);
          }
          
          // Exponential backoff before retrying
          await page.waitForTimeout(2000 * Math.pow(2, retryCount - 1));
        }
      }

      console.log('Page loaded, waiting for content...');
      
      // First check for and try to close any popup
      try {
        const closeButton = await Promise.race([
          page.waitForSelector('button[aria-label="Dismiss"]', { timeout: 5000 }),
          page.waitForSelector('.artdeco-modal__dismiss', { timeout: 5000 }),
          page.waitForSelector('.modal__dismiss', { timeout: 5000 })
        ]);
        
        if (closeButton) {
          console.log('Found popup, attempting to close...');
          await closeButton.click();
          await page.waitForTimeout(1000); // Wait for popup animation
        }
      } catch {
        console.log('No popup found or unable to close popup');
      }

      // Wait for job content
      const contentPromise = Promise.race([
        page.waitForSelector('h1.top-card-layout__title', { timeout: 10000 }),
        page.waitForSelector('h1.job-details-jobs-unified-top-card__job-title', { timeout: 10000 }),
        page.waitForSelector('h1.jobs-unified-top-card__job-title', { timeout: 10000 })
      ]);

      try {
        await contentPromise;
      } catch {
        // If content isn't found, check if we're blocked by a sign-in wall
        const isSignInRequired = await page.$('.sign-in-modal') || 
                               await page.$('.join-form') ||
                               await page.$('#organic-div');

        if (isSignInRequired) {
          throw new Error('Unable to access job details. The page requires sign-in and popup dismissal was unsuccessful.');
        }
      }

      // Extract job details using multiple possible selectors
      console.log('Extracting job details...');
      const title = await page.evaluate(() => {
        const titleSelectors = [
          'h1.top-card-layout__title',
          'h1.job-details-jobs-unified-top-card__job-title',
          'h1.jobs-unified-top-card__job-title'
        ];
        for (const selector of titleSelectors) {
          const element = document.querySelector(selector);
          if (element) return element.textContent?.trim();
        }
        return null;
      });

      // Extract company and location
      const { company, location } = await page.evaluate(() => {
        const companyElement = document.querySelector('.topcard__org-name-link');
        const locationElement = document.querySelector('.topcard__flavor--bullet');
        
        // Fallback selectors if the above don't work
        const fallbackCompanySelectors = [
          '.jobs-unified-top-card__company-name',
          '.top-card-layout__second-subline',
          '.job-details-jobs-unified-top-card__primary-description'
        ];

        let company = companyElement ? companyElement.textContent?.trim() : null;
        if (!company) {
          for (const selector of fallbackCompanySelectors) {
            const element = document.querySelector(selector);
            if (element) {
              company = element.textContent?.trim()?.split('·')[0]?.trim();
              break;
            }
          }
        }

        const location = locationElement ? locationElement.textContent?.trim() : null;

        return { company, location };
      });

      // Extract work type from job description
      const workType = await page.evaluate(() => {
        const jobDescription = document.body.textContent?.toLowerCase() || '';
        if (jobDescription.includes('100% remote') || jobDescription.includes('fully remote')) {
          return 'remote';
        } else if (jobDescription.includes('hybrid')) {
          return 'hybrid';
        }
        return 'onsite';
      });

      // Extract salary if available
      const { salaryMin, salaryMax, currency } = await page.evaluate(() => {
        const salaryText = document.body.textContent || '';
        const salaryMatch = salaryText.match(/(?:£|€|\$)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:-|to)\s*(?:£|€|\$)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
        
        let currency = 'GBP';
        if (salaryText.includes('€')) currency = 'EUR';
        else if (salaryText.includes('$')) currency = 'USD';

        if (salaryMatch) {
          const min = parseFloat(salaryMatch[1].replace(/,/g, ''));
          const max = parseFloat(salaryMatch[2].replace(/,/g, ''));
          return { salaryMin: min, salaryMax: max, currency };
        }
        
        return { salaryMin: null, salaryMax: null, currency };
      });

      console.log('Extracted data:', { title, company, location, workType });
      
      // If we couldn't get the essential data, return an error
      if (!title || !company) {
        throw new Error('Could not find job details on the page. The URL might be invalid or the page structure has changed.');
      }

      if (browser) {
        await browser.close();
      }

      return NextResponse.json({
        title,
        company,
        location,
        workType,
        salaryMin,
        salaryMax,
        currency,
        url,
        status: 'Applied',
        dateApplied: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error during extraction:', error);
      if (browser) {
        await browser.close();
      }
      throw error;
    }
  } catch (error) {
    console.error('Error extracting job details:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract job details. Please make sure the URL is correct and try again.' },
      { status: 500 }
    );
  }
}