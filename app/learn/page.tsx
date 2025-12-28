import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Learn Garhwali',
  description:
    'Common Garhwali phrases, pronunciation guidance, and cultural learning tips to help you get started.',
};

const phrases = [
  { garhwali: 'Namaste', meaning: 'Hello / Greetings' },
  { garhwali: 'Dhanyavaad', meaning: 'Thank you' },
  { garhwali: 'Tum kaisaa chaa?', meaning: 'How are you?' },
  { garhwali: 'Mai thik chu', meaning: "I'm fine" },
  { garhwali: 'Kothi jaandaa?', meaning: 'Where are you going?' },
  { garhwali: 'Mero naau ...', meaning: 'My name is ...' },
];

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Learn Garhwali
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Start with simple phrases, learn how sounds work, and understand the cultural context that gives Garhwali its warmth.
          Consistency beats intensity—practice a little every day.
        </p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span className="text-secondary">Common Phrases</span>
              <Badge variant="secondary" className="text-xs">Everyday</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {phrases.map((p) => (
                <li key={p.garhwali} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="font-medium text-foreground">{p.garhwali}</span>
                  <span className="text-sm text-muted-foreground">{p.meaning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Pronunciation Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              Garhwali pronunciation often follows clear vowel sounds. Try to keep vowels open and steady.
              Many words are best learned by listening—songs and spoken stories are excellent teachers.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">&#34;aa&#34;</span> is a long sound (like &#34;father&#34;)
              </li>
              <li>
                <span className="font-medium">&#34;ch&#34;</span> is a soft &#34;ch&#34; (as in &#34;chair&#34;)
              </li>
              <li>
                Stress is usually gentle; the rhythm of speech matters more than strong emphasis.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Cultural Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              Words are shaped by everyday life in the mountains—agriculture, forests, rivers, and close-knit communities.
              Greetings and honorifics can vary by village, family, and social setting.
            </p>
            <p>
              Listening to elders, folk songs, and local storytelling will teach you expressions that dictionaries may not capture.
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Learning Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>Practice with a friend or family member—real conversation helps memory.</li>
              <li>Write down new words and use them in a short sentence the same day.</li>
              <li>Learn through songs: repeat a chorus until it feels natural.</li>
              <li>Be kind to yourself—regional variation is normal and part of the beauty.</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10 rounded-2xl border bg-primary/5 p-6">
        <h2 className="text-xl font-semibold text-primary">Try the Translator</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Use the translator to experiment with vocabulary. If a word is missing, consider contributing—your knowledge helps everyone.
        </p>
      </section>
    </div>
  );
}
