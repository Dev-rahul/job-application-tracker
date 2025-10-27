import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { StatusDropdown } from "./StatusDropdown";
import { WorkTypeDropdown } from "./WorkTypeDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkType = z.enum(["onsite", "hybrid", "remote"]);
const Currency = z.enum(["GBP", "USD", "EUR"]);

type WorkType = z.infer<typeof WorkType>;
type Currency = z.infer<typeof Currency>;

const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  url: z.string().url("Please enter a valid URL"),
  workType: WorkType,
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: Currency,
  status: z.string(),
  notes: z.string().optional(),
  tags: z.string().optional(),
}).refine((data) => {
  // If one salary is provided, both should be provided
  if (data.salaryMin || data.salaryMax) {
    return data.salaryMin && data.salaryMax && data.salaryMin <= data.salaryMax;
  }
  return true;
}, {
  message: "Please provide both minimum and maximum salary, and ensure minimum is less than or equal to maximum",
  path: ["salaryMin"], // This will show the error on the salary min field
});

type FormValues = z.infer<typeof formSchema>;

interface AddJobFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  initialUrl?: string;
}

export function AddJobForm({ onSubmit, initialUrl = "" }: AddJobFormProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      url: initialUrl,
      workType: "onsite",
      salaryMin: undefined,
      salaryMax: undefined,
      currency: "GBP",
      status: "Applied",
      notes: "",
      tags: "",
    } as FormValues,
  });

  const extractJobDetails = async (url: string) => {
    setIsExtracting(true);
    setExtractError(null);
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract job details');
      }

      form.setValue('title', data.title);
      form.setValue('company', data.company);
      if (data.location) form.setValue('location', data.location);
      if (data.workType) form.setValue('workType', data.workType);
      if (data.currency) form.setValue('currency', data.currency);
      if (data.salaryMin) form.setValue('salaryMin', data.salaryMin);
      if (data.salaryMax) form.setValue('salaryMax', data.salaryMax);
    } catch (error) {
      console.error('Error extracting job details:', error);
      setExtractError(error instanceof Error ? error.message : 'Failed to extract job details');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Tech Company Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="London, UK" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="https://linkedin.com/jobs/..."
                    type="url"
                    {...field}
                    className={isExtracting ? "pr-10" : ""}
                    onChange={async (e) => {
                      field.onChange(e);
                      const url = e.target.value;
                      if (url.includes('linkedin.com/jobs')) {
                        await extractJobDetails(url);
                      }
                    }}
                    disabled={isExtracting}
                  />
                  {isExtracting && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                    </div>
                  )}
                </div>
              </FormControl>
              {extractError && (
                <p className="text-sm text-red-500">{extractError}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <StatusDropdown
                  currentStatus={field.value}
                  onStatusChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type</FormLabel>
                <FormControl>
                  <WorkTypeDropdown
                    currentType={field.value}
                    onTypeChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salaryMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salaryMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Salary</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about the application..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="remote, senior, frontend (comma separated)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Job Application
        </Button>
      </form>
    </Form>
  );
}