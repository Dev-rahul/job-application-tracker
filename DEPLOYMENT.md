// Commands to run after deployment to set up the database
npx vercel env pull .env.production.local  // Pull environment variables
npx prisma db push                         // Push the schema to the database