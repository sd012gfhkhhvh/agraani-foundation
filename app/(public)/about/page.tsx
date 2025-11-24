import { AnimatedCounter } from '@/components/public/animated-counter';
import { Timeline } from '@/components/public/timeline';
import { Card, CardContent } from '@/components/ui/card';
import { getAboutContent, getActiveObjectives } from '@/lib/data';
import { Award, Heart, Lightbulb, Target, TrendingUp, Users2 } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'About Us - Agraani Welfare Foundation',
  description:
    'Learn about our mission, vision, and commitment to empowering women and children in West Bengal through education and community development.',
};

export default async function AboutPage() {
  const [aboutContent, objectives] = await Promise.all([getAboutContent(), getActiveObjectives()]);

  const mission = aboutContent.find((c) => c.section === 'mission');
  const vision = aboutContent.find((c) => c.section === 'vision');
  const about = aboutContent.find((c) => c.section === 'about');

  // Timeline data - milestones and achievements
  const timelineItems = [
    {
      year: '2020',
      title: 'Foundation Established',
      description:
        'Agraani Welfare Foundation was founded with a vision to empower women and children in rural West Bengal.',
      icon: <Award className="h-4 w-4 md:h-6 md:w-6 text-white" />,
    },
    {
      year: '2021',
      title: 'First Education Program',
      description:
        'Launched our first educational initiative, providing learning resources to 100+ children.',
      icon: <Target className="h-4 w-4 md:h-6 md:w-6 text-white" />,
    },
    {
      year: '2022',
      title: 'Skill Development Center',
      description: 'Opened vocational training center, empowering women with employable skills.',
      icon: <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-white" />,
    },
    {
      year: '2023',
      title: 'Community Expansion',
      description: 'Expanded programs to 5 villages, reaching 500+ beneficiaries.',
      icon: <Users2 className="h-4 w-4 md:h-6 md:w-6 text-white" />,
    },
    {
      year: '2024',
      title: 'Digital Transformation',
      description: 'Launched digital literacy programs and online learning platforms.',
      icon: <Lightbulb className="h-4 w-4 md:h-6 md:w-6 text-white" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-linear-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              About <span className="text-secondary">Agraani</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
              Building a future where every woman has the opportunity to thrive and every child can
              dream
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 md:py-16 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <Card className="card-hover text-center">
              <CardContent className="p-4 md:p-6">
                <Heart className="h-8 w-8 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Lives Impacted</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-4 md:p-6">
                <Users2 className="h-8 w-8 md:h-12 md:w-12 text-secondary mx-auto mb-3 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-secondary mb-1 md:mb-2">
                  <AnimatedCounter end={10} suffix="+" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Active Programs</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-4 md:p-6">
                <Target className="h-8 w-8 md:h-12 md:w-12 text-accent mx-auto mb-3 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-accent mb-1 md:mb-2">
                  <AnimatedCounter end={5} />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Villages Reached</p>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-4 md:p-6">
                <Award className="h-8 w-8 md:h-12 md:w-12 text-primary mx-auto mb-3 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1 md:mb-2">
                  <AnimatedCounter end={4} />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">Years of Service</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Organization */}
      {about && (
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/10 shadow-xl">
              <CardContent className="p-6 md:p-8 lg:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gradient-primary">
                  {about.title}
                </h2>
                <div className="prose prose-sm md:prose-lg max-w-none text-muted-foreground leading-relaxed">
                  {about.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-12 md:py-20 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {mission && (
              <Card className="card-hover">
                <CardContent className="p-6 md:p-8">
                  <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 md:p-3 bg-primary/10 rounded-xl">
                      <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {mission.content}
                  </p>
                </CardContent>
              </Card>
            )}

            {vision && (
              <Card className="card-hover">
                <CardContent className="p-6 md:p-8">
                  <div className="inline-flex items-center gap-3 mb-4 md:mb-6">
                    <div className="p-2 md:p-3 bg-secondary/10 rounded-xl">
                      <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {vision.content}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Our Journey</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Milestones and achievements on our path to community transformation
            </p>
          </div>
          <Timeline items={timelineItems} />
        </div>
      </section>

      {/* Core Values / Objectives */}
      {objectives.length > 0 && (
        <section className="py-12 md:py-20 bg-linear-to-b from-muted/30 to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                Strategic Objectives
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Principles that guide our work and decision-making
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {objectives.map((objective, index) => (
                <Card key={objective.id} className="card-hover h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary font-bold text-lg md:text-xl mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3">{objective.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
