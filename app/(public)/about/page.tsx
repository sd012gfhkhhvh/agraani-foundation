import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Lightbulb, Users2, Heart } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'About Us - Agraani Welfare Foundation',
  description: 'Learn about our mission, vision, and commitment to empowering women and children in West Bengal through education and community development.',
};

export default async function AboutPage() {
  const [aboutContent, objectives] = await Promise.all([
    prisma.aboutContent.findMany(),
    prisma.objective.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
  ]);

  const mission = aboutContent.find(c => c.section === 'mission');
  const vision = aboutContent.find(c => c.section === 'vision');
  const about = aboutContent.find(c => c.section === 'about');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-secondary">Agraani</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Building a future where every woman has the opportunity to thrive and every child can dream
            </p>
          </div>
        </div>
      </section>

      {/* About Organization */}
      {about && (
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/10 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 text-gradient-primary">
                  {about.title}
                </h2>
                <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                  {about.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="py-20 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {mission && (
              <Card className="card-hover">
                <CardContent className="p-8">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {mission.content}
                  </p>
                </CardContent>
              </Card>
            )}

            {vision && (
              <Card className="card-hover">
                <CardContent className="p-8">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <Lightbulb className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {vision.content}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Strategic Objectives */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Strategic <span className="text-gradient-primary">Objectives</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our roadmap for creating sustainable impact in communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <Card key={objective.id} className="card-hover group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-smooth">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
                        {objective.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {objective.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-linear-to-b from-background to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient-secondary">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Compassion', description: 'We lead with empathy and understanding in everything we do' },
              { icon: Users2, title: 'Empowerment', description: 'We believe in creating opportunities for self-sufficiency and growth' },
              { icon: Target, title: 'Impact', description: 'We measure success through the positive change we create' },
            ].map((value, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="inline-flex p-4 bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                    <value.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
