import { Metadata } from 'next';
import { ContributionForm } from '@/components/ContributionForm';

export const metadata: Metadata = {
  title: 'Contribute - Garhwali Seva',
  description: 'Contribute Garhwali words and their meanings to help preserve the Garhwali language.',
};

export default function ContributePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
            Contribute to the Garhwali Dictionary
          </h1>
          <p className="text-muted-foreground text-lg">
            Help preserve and share the beauty of the Garhwali language by contributing
            words, their meanings, and usage examples.
          </p>
        </div>
        
        <ContributionForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Your contributions help keep the Garhwali language alive for future generations.
          </p>
        </div>
      </div>
    </div>
  );
}
