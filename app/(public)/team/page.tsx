import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Linkedin, Twitter, Users2, Heart } from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Our Team - Agraani Welfare Foundation',
  description: 'Meet the dedicated team behind Agraani Welfare Foundation working to empower women and transform communities.',
};

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/hexagons.svg')] opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Heart className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Led by Passion, Driven by Purpose</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meet Our <span className="text-secondary">Team</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Dedicated professionals committed to creating lasting change in communities across West Bengal
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {teamMembers.length === 0 ? (
            <Card className="p-16 text-center">
              <Users2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Our team information is coming soon</h3>
              <p className="text-muted-foreground">Check back to learn more about the people driving our mission</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="card-hover group overflow-hidden">
                  {/* Profile Image */}
                  <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary/10 to-secondary/10">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users2 className="h-24 w-24 text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  
                    {/* Social Links Overlay */}
                    {(member.email || member.phone || member.linkedIn) && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-smooth">
                        {member.email && (
                          <a 
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                          >
                            <Mail className="h-5 w-5 text-primary" />
                          </a>
                        )}
                        {member.phone && (
                          <a 
                            href={`tel:${member.phone}`}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                          >
                            <Phone className="h-5 w-5 text-primary" />
                          </a>
                        )}
                        {member.linkedIn && (
                          <a 
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-smooth"
                          >
                            <Linkedin className="h-5 w-5 text-primary" />
                          </a>
                        )}

                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    {member.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
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
      <section className="py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our <span className="text-gradient-primary">Mission</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're always looking for passionate individuals who want to make a difference. Get in touch to learn about opportunities.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth font-medium">
            <Mail className="h-5 w-5" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
