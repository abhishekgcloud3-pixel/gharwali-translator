'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Info, Loader2, Search, AlertTriangle } from 'lucide-react';
import type { ContributionInput } from '@/lib/validations/contribution';

// Character limits
const LIMITS = {
  garhwali_word: 100,
  hindi_meaning: 200,
  english_meaning: 200,
  usage_example: 500,
  contributor_name: 100,
} as const;

// ============================================================================
// Types
// ============================================================================

interface DuplicateMatch {
  garhwali_word: string;
  hindi_meaning: string;
  english_meaning: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ContributionFormProps {
  onSuccess?: (contributionId: string) => void;
  onError?: (message: string) => void;
}

// ============================================================================
// Character Counter Component
// ============================================================================

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

function CharacterCounter({ current, max, className }: CharacterCounterProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage > 100;
  
  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-200',
            isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={cn(
        isOverLimit ? 'text-red-500 font-medium' : 'text-muted-foreground'
      )}>
        {current}/{max}
      </span>
    </div>
  );
}

// ============================================================================
// Contribution Form Component
// ============================================================================

export function ContributionForm({ onSuccess, onError }: ContributionFormProps) {
  // Form state
  const [formData, setFormData] = React.useState<Partial<ContributionInput>>({
    garhwali_word: '',
    hindi_meaning: '',
    english_meaning: '',
    usage_example: '',
    category: 'noun',
    contributor_name: '',
    contributor_email: '',
  });
  
  // Validation state
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitResult, setSubmitResult] = React.useState<{
    success: boolean;
    message: string;
    contributionId?: string;
    duplicateMatches?: DuplicateMatch[];
  } | null>(null);
  
  // Real-time validation for each field
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  
  // =========================================================================
  // Validation Helpers
  // =========================================================================
  
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'garhwali_word':
        if (!value.trim()) return 'Garhwali word is required';
        if (value.trim().length > LIMITS.garhwali_word) 
          return `Must be ${LIMITS.garhwali_word} characters or less`;
        break;
      case 'hindi_meaning':
        if (!value.trim()) return 'Hindi meaning is required';
        if (value.trim().length > LIMITS.hindi_meaning) 
          return `Must be ${LIMITS.hindi_meaning} characters or less`;
        break;
      case 'english_meaning':
        if (!value.trim()) return 'English meaning is required';
        if (value.trim().length > LIMITS.english_meaning) 
          return `Must be ${LIMITS.english_meaning} characters or less`;
        break;
      case 'usage_example':
        if (value.length > LIMITS.usage_example) 
          return `Must be ${LIMITS.usage_example} characters or less`;
        break;
      case 'contributor_email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
    }
    return undefined;
  };
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['garhwali_word', 'hindi_meaning', 'english_meaning'];
    for (const field of requiredFields) {
      const error = validateField(field, formData[field as keyof ContributionInput] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    
    // Validate optional fields
    const optionalFields = ['usage_example', 'contributor_email'];
    for (const field of optionalFields) {
      const error = validateField(field, formData[field as keyof ContributionInput] || '');
      if (error) {
        newErrors[field] = error;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // =========================================================================
  // Event Handlers
  // =========================================================================
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as ContributionInput['category'] }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      garhwali_word: true,
      hindi_meaning: true,
      english_meaning: true,
      usage_example: true,
      contributor_email: true,
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      const response = await fetch('/api/contributions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garhwali_word: formData.garhwali_word,
          hindi_meaning: formData.hindi_meaning,
          english_meaning: formData.english_meaning,
          usage_example: formData.usage_example,
          category: formData.category,
          contributor_name: formData.contributor_name,
          contributor_email: formData.contributor_email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check for duplicates
        if (data.duplicateMatches) {
          setSubmitResult({
            success: false,
            message: data.message,
            duplicateMatches: data.duplicateMatches,
          });
        } else {
          setSubmitResult({
            success: false,
            message: data.message || 'Failed to submit contribution',
          });
        }
        onError?.(data.message);
        return;
      }
      
      setSubmitResult({
        success: true,
        message: data.message,
        contributionId: data.contributionId,
      });
      
      // Reset form on success
      setFormData({
        garhwali_word: '',
        hindi_meaning: '',
        english_meaning: '',
        usage_example: '',
        category: 'noun',
        contributor_name: '',
        contributor_email: '',
      });
      setTouched({});
      setErrors({});
      
      onSuccess?.(data.contributionId);
      
    } catch {
      const message = 'An error occurred. Please try again.';
      setSubmitResult({
        success: false,
        message,
      });
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // =========================================================================
  // Render
  // =========================================================================
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Community</Badge>
          Contribute a Word
        </CardTitle>
        <CardDescription>
          Help grow the Garhwali dictionary by sharing words, phrases, and their meanings.
          Your contribution will be reviewed by our team before being published.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success/Error Messages */}
        {submitResult && (
          <div
            className={cn(
              'mb-6 p-4 rounded-lg flex items-start gap-3',
              submitResult.success
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
            )}
          >
            {submitResult.success ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-medium">{submitResult.message}</p>
              
              {/* Duplicate matches */}
              {submitResult.duplicateMatches && submitResult.duplicateMatches.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Matching entries found in dictionary:
                  </p>
                  <ul className="space-y-2">
                    {submitResult.duplicateMatches.map((match, i) => (
                      <li 
                        key={i}
                        className="text-sm bg-white/50 p-2 rounded border border-yellow-200/50"
                      >
                        <p className="font-medium">{match.garhwali_word}</p>
                        <p className="text-muted-foreground">
                          HI: {match.hindi_meaning} | EN: {match.english_meaning}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubmitResult(null)}
              className="shrink-0"
            >
              Dismiss
            </Button>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Garhwali Word */}
          <div className="space-y-2">
            <label 
              htmlFor="garhwali_word" 
              className="text-sm font-medium leading-none"
            >
              Garhwali Word <span className="text-red-500">*</span>
            </label>
            <Input
              id="garhwali_word"
              name="garhwali_word"
              value={formData.garhwali_word || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter the word in Garhwali (Devanagari script)"
              className={cn(
                errors.garhwali_word && touched.garhwali_word && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.garhwali_word && touched.garhwali_word && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.garhwali_word}
              </p>
            )}
            <CharacterCounter 
              current={(formData.garhwali_word || '').length} 
              max={LIMITS.garhwali_word} 
            />
          </div>
          
          {/* Meanings Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Hindi Meaning */}
            <div className="space-y-2">
              <label 
                htmlFor="hindi_meaning" 
                className="text-sm font-medium leading-none"
              >
                Hindi Meaning <span className="text-red-500">*</span>
              </label>
              <Input
                id="hindi_meaning"
                name="hindi_meaning"
                value={formData.hindi_meaning || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Hindi translation"
                className={cn(
                  errors.hindi_meaning && touched.hindi_meaning && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.hindi_meaning && touched.hindi_meaning && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.hindi_meaning}
                </p>
              )}
              <CharacterCounter 
                current={(formData.hindi_meaning || '').length} 
                max={LIMITS.hindi_meaning} 
              />
            </div>
            
            {/* English Meaning */}
            <div className="space-y-2">
              <label 
                htmlFor="english_meaning" 
                className="text-sm font-medium leading-none"
              >
                English Meaning <span className="text-red-500">*</span>
              </label>
              <Input
                id="english_meaning"
                name="english_meaning"
                value={formData.english_meaning || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="English translation"
                className={cn(
                  errors.english_meaning && touched.english_meaning && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
              {errors.english_meaning && touched.english_meaning && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.english_meaning}
                </p>
              )}
              <CharacterCounter 
                current={(formData.english_meaning || '').length} 
                max={LIMITS.english_meaning} 
              />
            </div>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium leading-none">
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noun">Noun</SelectItem>
                <SelectItem value="verb">Verb</SelectItem>
                <SelectItem value="adjective">Adjective</SelectItem>
                <SelectItem value="adverb">Adverb</SelectItem>
                <SelectItem value="phrase">Phrase</SelectItem>
                <SelectItem value="song_phrase">Song Phrase</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Usage Example */}
          <div className="space-y-2">
            <label 
              htmlFor="usage_example" 
              className="text-sm font-medium leading-none flex items-center gap-1"
            >
              Usage Example
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="usage_example"
              name="usage_example"
              value={formData.usage_example || ''}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Example: Namaste, tu kaise hai?"
              className={cn(
                errors.usage_example && touched.usage_example && 'border-red-500 focus-visible:ring-red-500'
              )}
            />
            {errors.usage_example && touched.usage_example && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.usage_example}
              </p>
            )}
            <CharacterCounter 
              current={(formData.usage_example || '').length} 
              max={LIMITS.usage_example} 
            />
          </div>
          
          {/* Preview Section */}
          {(formData.garhwali_word || formData.hindi_meaning || formData.english_meaning) && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <Info className="h-4 w-4" />
                Preview
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Word:</span> {formData.garhwali_word || '—'}
                </p>
                <p>
                  <span className="font-medium">Hindi:</span> {formData.hindi_meaning || '—'}
                </p>
                <p>
                  <span className="font-medium">English:</span> {formData.english_meaning || '—'}
                </p>
                {formData.usage_example && (
                  <p>
                    <span className="font-medium">Example:</span> {formData.usage_example}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Contributor Info (Optional) */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Your information (optional - for attribution and updates)
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label 
                  htmlFor="contributor_name" 
                  className="text-sm font-medium leading-none"
                >
                  Your Name
                </label>
                <Input
                  id="contributor_name"
                  name="contributor_name"
                  value={formData.contributor_name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
                <CharacterCounter 
                  current={(formData.contributor_name || '').length} 
                  max={LIMITS.contributor_name} 
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="contributor_email" 
                  className="text-sm font-medium leading-none"
                >
                  Your Email
                </label>
                <Input
                  type="email"
                  id="contributor_email"
                  name="contributor_email"
                  value={formData.contributor_email || ''}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  className={cn(
                    errors.contributor_email && touched.contributor_email && 'border-red-500 focus-visible:ring-red-500'
                  )}
                />
                {errors.contributor_email && touched.contributor_email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contributor_email}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Contribution'
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            By submitting, you agree to contribute under our open license terms.
            Submissions are reviewed before publication.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
