'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contributionSchema, type ContributionFormData } from '@/lib/validations/contribution';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Send, RotateCcw } from 'lucide-react';

const GARHWALI_WORD_MAX = 100;
const HINDI_MEANING_MAX = 500;
const ENGLISH_MEANING_MAX = 500;
const USAGE_EXAMPLE_MAX = 1000;
const CONTRIBUTOR_NAME_MAX = 100;
const CONTRIBUTOR_EMAIL_MAX = 100;

export function ContributionForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      garhwaliWord: '',
      hindiMeaning: '',
      englishMeaning: '',
      usageExample: '',
      contributorName: '',
      contributorEmail: '',
    },
  });

  // Watch fields for character counters
  const watchedGarhwaliWord = watch('garhwaliWord', '');
  const watchedHindiMeaning = watch('hindiMeaning', '');
  const watchedEnglishMeaning = watch('englishMeaning', '');
  const watchedUsageExample = watch('usageExample', '');
  const watchedContributorName = watch('contributorName', '');
  const watchedContributorEmail = watch('contributorEmail', '');

  const onSubmit = async (data: ContributionFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contributions/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contribution');
      }

      toast.success('Contribution Submitted!', {
        description: 'Thank you for contributing to the Garhwali dictionary.',
      });

      reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      toast.error('Submission Failed', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Contribute a Garhwali Word
        </CardTitle>
        <CardDescription>
          Help preserve the Garhwali language by sharing words and their meanings.
          Your contribution will be reviewed and added to our dictionary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Garhwali Word (Required) */}
          <div className="space-y-2">
            <Label htmlFor="garhwaliWord">
              Garhwali Word <span className="text-destructive">*</span>
            </Label>
            <Input
              id="garhwaliWord"
              placeholder="Enter the Garhwali word"
              {...register('garhwaliWord')}
              maxLength={GARHWALI_WORD_MAX + 1}
              aria-invalid={!!errors.garhwaliWord}
              aria-describedby={errors.garhwaliWord ? 'garhwaliWord-error' : undefined}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span id="garhwaliWord-error" className="text-destructive" role="alert">
                {errors.garhwaliWord?.message}
              </span>
              <span>
                {(watchedGarhwaliWord || '').length}/{GARHWALI_WORD_MAX}
              </span>
            </div>
          </div>

          {/* Hindi Meaning (Required) */}
          <div className="space-y-2">
            <Label htmlFor="hindiMeaning">
              Hindi Meaning <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="hindiMeaning"
              placeholder="Enter the Hindi meaning"
              {...register('hindiMeaning')}
              maxLength={HINDI_MEANING_MAX + 1}
              rows={2}
              aria-invalid={!!errors.hindiMeaning}
              aria-describedby={errors.hindiMeaning ? 'hindiMeaning-error' : undefined}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span id="hindiMeaning-error" className="text-destructive" role="alert">
                {errors.hindiMeaning?.message}
              </span>
              <span>
                {(watchedHindiMeaning || '').length}/{HINDI_MEANING_MAX}
              </span>
            </div>
          </div>

          {/* English Meaning (Required) */}
          <div className="space-y-2">
            <Label htmlFor="englishMeaning">
              English Meaning <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="englishMeaning"
              placeholder="Enter the English meaning"
              {...register('englishMeaning')}
              maxLength={ENGLISH_MEANING_MAX + 1}
              rows={2}
              aria-invalid={!!errors.englishMeaning}
              aria-describedby={errors.englishMeaning ? 'englishMeaning-error' : undefined}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span id="englishMeaning-error" className="text-destructive" role="alert">
                {errors.englishMeaning?.message}
              </span>
              <span>
                {(watchedEnglishMeaning || '').length}/{ENGLISH_MEANING_MAX}
              </span>
            </div>
          </div>

          {/* Usage Example (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="usageExample">
              Usage Example <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="usageExample"
              placeholder="Enter an example sentence showing how the word is used"
              {...register('usageExample')}
              maxLength={USAGE_EXAMPLE_MAX + 1}
              rows={3}
              aria-invalid={!!errors.usageExample}
              aria-describedby={errors.usageExample ? 'usageExample-error' : 'usageExample-hint'}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span id="usageExample-error" className="text-destructive" role="alert">
                {errors.usageExample?.message}
              </span>
              <span id="usageExample-hint">
                {(watchedUsageExample || '').length}/{USAGE_EXAMPLE_MAX}
              </span>
            </div>
          </div>

          {/* Contributor Info Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Contributor Information (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contributor Name (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="contributorName">Your Name</Label>
                <Input
                  id="contributorName"
                  placeholder="Enter your name"
                  {...register('contributorName')}
                  maxLength={CONTRIBUTOR_NAME_MAX + 1}
                  aria-invalid={!!errors.contributorName}
                  aria-describedby={errors.contributorName ? 'contributorName-error' : undefined}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span id="contributorName-error" className="text-destructive" role="alert">
                    {errors.contributorName?.message}
                  </span>
                  <span>
                    {(watchedContributorName || '').length}/{CONTRIBUTOR_NAME_MAX}
                  </span>
                </div>
              </div>

              {/* Contributor Email (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="contributorEmail">Your Email</Label>
                <Input
                  id="contributorEmail"
                  type="email"
                  placeholder="Enter your email"
                  {...register('contributorEmail')}
                  maxLength={CONTRIBUTOR_EMAIL_MAX + 1}
                  aria-invalid={!!errors.contributorEmail}
                  aria-describedby={errors.contributorEmail ? 'contributorEmail-error' : undefined}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span id="contributorEmail-error" className="text-destructive" role="alert">
                    {errors.contributorEmail?.message}
                  </span>
                  <span>
                    {(watchedContributorEmail || '').length}/{CONTRIBUTOR_EMAIL_MAX}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Contribution
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
