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

export const translationSchema = z.object({
  text: z.string().min(1, 'Text to translate is required').max(5000, 'Text must be 5000 characters or less'),
  target_lang: z.enum(['hindi', 'english'], {
    required_error: 'Target language is required',
    invalid_type_error: 'Target language must be hindi or english',
  }),
});

export type TranslationFormData = z.infer<typeof translationSchema>;
