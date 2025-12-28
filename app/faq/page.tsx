import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about how Garhwali translation works, accuracy expectations, limitations, and browser support.',
};

const faqs = [
  {
    q: 'How does the translation work?',
    a: 'Translations are produced using a dictionary-based approach. The system matches words and phrases it recognizes and highlights anything it cannot confidently translate.',
  },
  {
    q: 'Why are some words highlighted as untranslated?',
    a: 'Garhwali has many regional variations and spellings. If a word is not found in the current dictionary, it will be marked so you can identify missing coverage.',
  },
  {
    q: 'How accurate are the results?',
    a: 'Accuracy depends on the input text and available dictionary entries. Short everyday phrases tend to work best. For poetry, songs, and idioms, translations may miss nuance.',
  },
  {
    q: 'What are the limitations of a dictionary translator?',
    a: 'Dictionary translation does not fully understand grammar, context, or idioms. It may produce literal output, and word order may not always match natural Hindi/English.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'The site works on modern versions of Chrome, Edge, Firefox, and Safari. Speech input availability may depend on browser and device support.',
  },
  {
    q: 'How can I contribute to improving translations?',
    a: 'Visit the Contribute page to submit new words, meanings, and example usage. Community contributions help expand coverage over time.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">FAQ</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Answers to common questions about translation quality, limitations, and how you can help improve the dictionary.
        </p>
      </header>

      <section className="mt-8 grid gap-6">
        {faqs.map((item) => (
          <Card key={item.q} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-secondary text-lg">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              {item.a}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border bg-accent/10 p-6">
        <h2 className="text-xl font-semibold text-primary">Need help?</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          If you find a missing word or a better translation, contributing improves the experience for everyone.
        </p>
      </section>
    </div>
  );
}
