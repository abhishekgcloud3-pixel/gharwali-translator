import { ContributionForm } from '@/components/ContributionForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Shield, Lightbulb } from 'lucide-react';

/**
 * Contribute Page
 * 
 * /contribute
 * 
 * Community contribution page where users can submit new Garhwali words
 * and corrections to the dictionary.
 * 
 * Features:
 * - Contribution form with validation
 * - Information about the contribution process
 * - Success/error feedback
 * 
 * @page
 */

export default function ContributePage() {
  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Users className="h-3 w-3 mr-1" />
            Community Driven
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Contribute to the Garhwali Dictionary
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help preserve and grow the Garhwali language by sharing words, phrases, 
            and their meanings. Your contributions help future generations connect 
            with their linguistic heritage.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main Form */}
          <div>
            <ContributionForm 
              onSuccess={(contributionId) => {
                console.log('Contribution submitted:', contributionId);
              }}
              onError={(message) => {
                console.error('Contribution error:', message);
              }}
            />
          </div>
          
          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Submit Your Word</p>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form with the word, meanings, and optionally an example.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Review Process</p>
                    <p className="text-sm text-muted-foreground">
                      Our team reviews submissions for accuracy and consistency.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Get Published</p>
                    <p className="text-sm text-muted-foreground">
                      Approved words are added to the dictionary with your attribution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Submission Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>Use proper Devanagari script for Garhwali words</p>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>Provide accurate translations in Hindi and English</p>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>Include usage examples when possible</p>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>Check if the word already exists before submitting</p>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <p>Be respectful and accurate in your contributions</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Attribution Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Attribution</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  If you provide your name and email, approved contributions will 
                  credit you as the contributor. Your email will only be used to 
                  notify you about your submission status.
                </p>
                <p>
                  All contributions are published under the same open license as 
                  the rest of the dictionary.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
