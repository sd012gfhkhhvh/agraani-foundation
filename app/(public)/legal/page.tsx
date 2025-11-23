import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getLegalDocuments } from '@/lib/data';
import { Calendar, CheckCircle, Clock, Download, FileText } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600; // ISR - revalidate every hour

export const metadata: Metadata = {
  title: 'Legal & Compliance - Agraani Welfare Foundation',
  description: 'View our legal registrations, certifications, and compliance documents.',
};

export default async function LegalPage() {
  const legalDocs = await getLegalDocuments();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-linear-to-br from-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Transparent & Compliant</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Legal & <span className="text-secondary">Compliance</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              All our registrations, certifications, and legal documents for full transparency
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {legalDocs.length === 0 ? (
            <Card className="p-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Documents will be updated soon</h3>
              <p className="text-muted-foreground">
                We're working on uploading our compliance documents
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {legalDocs.map((doc) => (
                <Card key={doc.id} className="card-hover group">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Icon */}
                      <div className="shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-smooth">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start gap-3 mb-3">
                          <h3 className="text-xl md:text-2xl font-bold">{doc.documentType}</h3>
                          <Badge variant="default">{doc.documentType}</Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-4">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <div className="text-sm font-medium">Registration Number</div>
                              <div className="text-muted-foreground font-mono">
                                {doc.registrationNumber}
                              </div>
                            </div>
                          </div>

                          {doc.issueDate && (
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="text-sm font-medium">Issue Date</div>
                                <div className="text-muted-foreground">
                                  {new Date(doc.issueDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {doc.expiryDate && (
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="text-sm font-medium">Valid Until</div>
                                <div className="text-muted-foreground">
                                  {new Date(doc.expiryDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {doc.notes && (
                          <p className="text-sm text-muted-foreground mb-4">{doc.notes}</p>
                        )}

                        {doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth text-sm font-medium"
                          >
                            <Download className="h-4 w-4" />
                            Download Document
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Our Commitment to Transparency</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    We believe in full transparency and accountability. All our legal registrations
                    and certifications are available for public review. We maintain compliance with
                    all applicable laws and regulations.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For any questions about our legal status or compliance, please{' '}
                    <a href="/contact" className="text-primary hover:underline">
                      contact us
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
