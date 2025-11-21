import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Heart, Sparkles, Target, Users } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Agraani Welfare Foundation - Empowering Women, Transforming Lives',
  description:
    'Join us in empowering women and children through education, skill training, and community development in West Bengal, India.',
};

export default async function HomePage() {
  const [heroBanners, programs, objectives] = await Promise.all([
    prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 1,
    }),
    prisma.program.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.objective.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 4,
    }),
  ]);

  const hero = heroBanners[0];

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: hero?.imageUrl
                ? `url(${hero.imageUrl})`
                : 'linear-gradient(135deg, #2D5F3F 0%, #4A8B63 100%)',
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.1),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Transforming Lives Since 2020</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              {hero?.title || 'Empowering Women,'}
              <br />
              <span className="text-gradient-secondary">
                {hero?.subtitle || 'Transforming Communities'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed animate-fade-in">
              {hero?.description ||
                'Join us in creating sustainable change through education, skill development, and community empowerment across West Bengal.'}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Button
                asChild
                size="lg"
                className="btn-gradient-secondary text-lg px-8 py-6 hover:scale-105 transition-smooth"
              >
                <Link href="/donate">
                  <Heart className="h-5 w-5 mr-2" />
                  Support Our Mission
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6"
              >
                <Link href="/programs">
                  Explore Programs
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '1000+', label: 'Women Empowered', icon: Users },
              { value: '50+', label: 'Villages Reached', icon: Target },
              { value: '15+', label: 'Active Programs', icon: Sparkles },
              { value: '5+', label: 'Years of Impact', icon: Heart },
            ].map((stat, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-4xl font-bold text-gradient-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient-primary">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive initiatives designed to create lasting change in communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Card key={program.id} className="card-hover group overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{program.description}</p>
                  <Link
                    href="/programs"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="btn-gradient-primary text-white">
              <Link href="/programs">
                View All Programs
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient-secondary">Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strategic objectives driving sustainable community development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <Card key={objective.id} className="card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{objective.title}</h3>
                    <p className="text-muted-foreground">{objective.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Be the Change You Want to See</h2>
          <p className="text-xl mb-8 opacity-90">
            Your support helps us empower more women and transform more communities every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6"
            >
              <Link href="/donate">
                <Heart className="h-5 w-5 mr-2" />
                Donate Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
            >
              <Link href="/contact">
                Get Involved
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
