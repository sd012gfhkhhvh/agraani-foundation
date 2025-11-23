import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getActivePrograms } from '@/lib/data';
import { ArrowRight, Book, Heart, Sparkles, Users } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Our Programs - Agraani Welfare Foundation',
  description:
    'Explore our comprehensive programs focused on women empowerment, education, and community development.',
};

export default async function ProgramsPage() {
  const programs = await getActivePrograms();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-linear-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Creating Lasting Impact</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-secondary">Programs</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Comprehensive initiatives designed to empower women and transform communities through
              education, skill development, and sustainable livelihood opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {programs.length === 0 ? (
            <Card className="p-16 text-center">
              <Book className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No programs available yet</h3>
              <p className="text-muted-foreground">Check back soon for our upcoming initiatives</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <Card
                  key={program.id}
                  className="card-hover group overflow-hidden h-full flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <ImageWithFallback
                      src={program.imageUrl}
                      alt={program.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Number Badge */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-primary text-xl shadow-lg">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-2xl font-bold text-white mb-1">{program.title}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                      {program.description}
                    </p>

                    {/* Action Button */}
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-smooth"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Support This Program
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Making a <span className="text-gradient-primary">Real Difference</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our programs are designed with community input and driven by measurable outcomes. We
                work hand-in-hand with local leaders to ensure sustainable, long-term impact.
              </p>
              <ul className="space-y-4">
                {[
                  'Community-centered approach',
                  'Skills training & certification',
                  'Mentorship & ongoing support',
                  'Sustainable livelihood creation',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="card-hover">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Users, value: '500+', label: 'Beneficiaries' },
                    { icon: Book, value: '12', label: 'Active Programs' },
                    { icon: Heart, value: '30+', label: 'Partners' },
                    { icon: Sparkles, value: '95%', label: 'Success Rate' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <div className="text-3xl font-bold text-gradient-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <div className="relative p-8 md:p-12 bg-linear-to-r from-primary/5 to-secondary/5">
              <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to <span className="text-gradient-primary">Make an Impact?</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Your support helps us expand our programs and reach more communities in need.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/donate">
                    <Button size="lg" className="btn-gradient-primary">
                      <Heart className="h-5 w-5 mr-2" />
                      Donate Now
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Partner With Us
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
