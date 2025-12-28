import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Garhwali',
  description:
    'Learn about the Garhwali language, its cultural roots in Uttarakhand, and why preservation matters.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          About the Garhwali Language
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Garhwali (गढ़वळी) is a vibrant Indo-Aryan language spoken across the Garhwal region of Uttarakhand.
          It carries the stories, songs, and lived traditions of the Himalayas—passed down through generations.
        </p>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">History & Region</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              The Garhwal Himalayas—ranging from river valleys to high mountain villages—have nurtured a rich linguistic ecosystem.
              Garhwali evolved alongside local folk traditions, trade routes, and Himalayan ecology.
            </p>
            <p>
              You’ll hear Garhwali in everyday conversation, local markets, village gatherings, and especially in folk music
              (mangal geet, jhoda, chhopati) that celebrates community life.
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Cultural Significance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              Language is more than words—it is identity. Garhwali expresses relationship to land (pahad),
              elders, seasons, food, and festivals in a way that translations can’t fully capture.
            </p>
            <p>
              Preserving Garhwali helps preserve oral histories, proverbs, lullabies, and ritual vocabulary that forms the cultural backbone of Uttarakhand.
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Quick Garhwali Facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium">Region:</span> Garhwal division, Uttarakhand, India
              </li>
              <li>
                <span className="font-medium">Script:</span> Devanagari (commonly), and oral traditions
              </li>
              <li>
                <span className="font-medium">Expression:</span> Rich vocabulary for nature, kinship, and local customs
              </li>
              <li>
                <span className="font-medium">Living culture:</span> Strong presence in folk songs and community storytelling
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-secondary">Why Preservation Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
            <p>
              Many regional languages face pressure from migration, reduced intergenerational transmission, and limited digital support.
              Preservation doesn’t mean freezing a language—it means keeping it useful, visible, and loved.
            </p>
            <p>
              Garhwali Seva aims to support learners, creators, and communities by making translation and learning tools more accessible.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10 rounded-2xl border bg-accent/10 p-6">
        <h2 className="text-xl font-semibold text-primary">Our Mission</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Build modern, friendly tools for Garhwali—while respecting the depth and nuance of the language.
          If you can contribute words, phrases, or examples, we’d love your help.
        </p>
      </section>
    </div>
  );
}
