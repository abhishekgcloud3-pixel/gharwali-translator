import { COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem-12rem)] py-12 px-4 text-center">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-primary font-bold">
            Welcome to Garhwali Seva
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A platform dedicated to serving the Garhwali community and promoting the rich cultural heritage of Uttarakhand.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="px-8">
              Explore More
            </Button>
            <Button size="lg" variant="secondary" className="px-8">
              Our Mission
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24 bg-slate-50 rounded-3xl">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-secondary font-bold">
            Feature Section
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Discover the beauty of Garhwal and the services we offer.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-12">
          {/* Feature cards can go here */}
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6 bg-accent/10">
              <div className="space-y-2">
                <h3 className="font-bold text-accent">Culture</h3>
                <p className="text-sm text-muted-foreground">
                  Preserving and promoting Garhwali traditions.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6 bg-primary/10">
              <div className="space-y-2">
                <h3 className="font-bold text-primary">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Connecting people across the globe.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6 bg-secondary/10">
              <div className="space-y-2">
                <h3 className="font-bold text-secondary">Service</h3>
                <p className="text-sm text-muted-foreground">
                  Dedicated support for local initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
