import { ProgramFlipCard } from '@/components/public/program-flip-card';
import { Card } from '@/components/ui/card';
import { getActivePrograms } from '@/lib/data';
import { Book, Sparkles, Target, TrendingUp, Users } from 'lucide-react';
import { Metadata } from 'next';

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
      <section className="relative py-16 md:py-20 lg:py-28 bg-linear-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 md:mb-6">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
              <span className="text-xs md:text-sm font-medium">Creating Lasting Impact</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Our <span className="text-secondary">Programs</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed">
              Comprehensive initiatives designed to empower women and transform communities through
              education, skill development, and sustainable livelihood opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Programs with Flip Cards */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {programs.length === 0 ? (
            <Card className="p-12 md:p-16 text-center">
              <Book className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">No programs available yet</h3>
              <p className="text-muted-foreground">Check back soon for our upcoming initiatives</p>
            </Card>
          ) : (
            <>
              {/* Section Header */}
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                  Our <span className="text-gradient-primary">Initiatives</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hover or tap on any card to explore detailed information about our programs
                </p>
              </div>

              {/* Flip Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {programs.map((program) => (
                  <ProgramFlipCard key={program.id} program={program} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 md:py-20 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Program <span className="text-gradient-secondary">Impact</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Measurable outcomes from our community programs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <Card className="card-hover text-center">
              <div className="p-6 md:p-8">
                <div className="inline-flex p-3 md:p-4 bg-primary/10 rounded-2xl mb-3 md:mb-4">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">500+</div>
                <p className="text-xs md:text-sm text-muted-foreground">Beneficiaries</p>
              </div>
            </Card>

            <Card className="card-hover text-center">
              <div className="p-6 md:p-8">
                <div className="inline-flex p-3 md:p-4 bg-secondary/10 rounded-2xl mb-3 md:mb-4">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-secondary mb-1 md:mb-2">
                  85%
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Success Rate</p>
              </div>
            </Card>

            <Card className="card-hover text-center">
              <div className="p-6 md:p-8">
                <div className="inline-flex p-3 md:p-4 bg-accent/10 rounded-2xl mb-3 md:mb-4">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-accent" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-accent mb-1 md:mb-2">
                  {programs.length}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Active Programs</p>
              </div>
            </Card>

            <Card className="card-hover text-center">
              <div className="p-6 md:p-8">
                <div className="inline-flex p-3 md:p-4 bg-primary/10 rounded-2xl mb-3 md:mb-4">
                  <Book className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">200+</div>
                <p className="text-xs md:text-sm text-muted-foreground">Workshops</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
