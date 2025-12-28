import { z } from 'zod';

export const contributionSchema = z.object({
  garhwaliWord: z
    .string()
    .min(1, 'Garhwali word is required')
    .max(100, 'Garhwali word must be 100 characters or less'),
  hindiMeaning: z
    .string()
    .min(1, 'Hindi meaning is required')
    .max(500, 'Hindi meaning must be 500 characters or less'),
  englishMeaning: z
    .string()
    .min(1, 'English meaning is required')
    .max(500, 'English meaning must be 500 characters or less'),
  usageExample: z
    .string()
    .max(1000, 'Usage example must be 1000 characters or less')
    .optional(),
  contributorName: z
    .string()
    .max(100, 'Name must be 100 characters or less')
    .optional(),
  contributorEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be 100 characters or less')
    .optional(),
});

export type ContributionFormData = z.infer<typeof contributionSchema>;
