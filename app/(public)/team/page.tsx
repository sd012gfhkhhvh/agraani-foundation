import { ImageWithFallback } from '@/components/public/image-with-fallback';
import { Card, CardContent } from '@/components/ui/card';
import { getActiveTeamMembers } from '@/lib/data';
import { Heart, Linkedin, Mail, Phone, Users2 } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Our Team - Agraani Welfare Foundation',
  description:
    'Meet the dedicated team behind Agraani Welfare Foundation working to empower women and transform communities.',
};

export default async function TeamPage() {
  const teamMembers = await getActiveTeamMembers();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-linear-to-br from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/hexagons.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 md:mb-6">
              <Heart className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
              <span className="text-xs md:text-sm font-medium">
                Led by Passion, Driven by Purpose
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Meet Our <span className="text-secondary">Team</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90">
              Dedicated professionals committed to creating lasting change in communities across
              West Bengal
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {teamMembers.length === 0 ? (
            <Card className="p-12 md:p-16 text-center">
              <Users2 className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                Our team information is coming soon
              </h3>
              <p className="text-muted-foreground">
                Check back to learn more about the people driving our mission
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="card-hover group overflow-hidden h-full">
                  {/* Profile Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-smooth"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

                    {/* Social Links Overlay */}
                    {(member.email || member.phone || member.linkedIn) && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-smooth">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                            aria-label="Email"
                          >
                            <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                            aria-label="Phone"
                          >
                            <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </a>
                        )}
                        {member.linkedIn && (
                          <a
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <CardContent className="p-5 md:p-6 text-center">
                    <h3 className="text-lg md:text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium text-sm md:text-base mb-3">
                      {member.position}
                    </p>
                    {member.bio && (
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Join Our <span className="text-gradient-primary">Mission</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            We're always looking for passionate individuals who want to make a difference. Get in
            touch to learn about opportunities.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth font-medium text-sm md:text-base"
          >
            <Mail className="h-4 w-4 md:h-5 md:w-5" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
