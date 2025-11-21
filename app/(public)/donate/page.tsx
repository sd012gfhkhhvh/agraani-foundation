import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, CreditCard, Building, Users, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Donate - Agraani Welfare Foundation',
  description: 'Support our mission to empower women and transform communities. Your donation makes a real difference.',
};

export default function DonatePage() {
  const donationAmounts = [500, 1000, 2500, 5000];
  const impactStats = [
    { amount: '₹500', impact: 'Provides educational materials for 5 children' },
    { amount: '₹1,000', impact: 'Supports skill training for 2 women' },
    { amount: '₹2,500', impact: 'Funds a complete empowerment workshop' },
    { amount: '₹5,000', impact: 'Sponsors livelihood training for a family' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-linear-to-br from-accent via-secondary to-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/plus.svg')] opacity-10" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Heart className="h-16 w-16 mx-auto mb-6 animate-pulse" />
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Make a <span className="text-white/90">Difference</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              Your generous donation helps us empower women, educate children, and transform communities across West Bengal.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Shield className="h-5 w-5" />
              <span className="font-medium">100% Secure & Tax Deductible (80G)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-gradient-primary">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Every contribution, big or small, creates meaningful change
            </p>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {donationAmounts.map((amount) => (
              <Card key={amount} className="card-hover group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gradient-primary mb-2">
                    ₹{amount.toLocaleString()}
                  </div>
                  <Button className="w-full btn-gradient-primary mt-2 opacity-0 group-hover:opacity-100 transition-smooth">
                    Donate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Amount */}
          <Card className="shadow-xl mb-12">
            <CardContent className="p-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">Or Enter Custom Amount</h3>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button className="btn-gradient-primary px-8">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Breakdown */}
          <div className="grid md:grid -cols-2 gap-6 mb-12">
            {impactStats.map((stat, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gradient-primary mb-1">
                      {stat.amount}
                    </div>
                    <p className="text-muted-foreground">{stat.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-linear-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Multiple Ways to Contribute</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-hover text-center">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                  <CreditCard className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Online Payment</h3>
                <p className="text-muted-foreground mb-4">
                  Credit/Debit Card, UPI, Net Banking
                </p>
                <Button variant="outline" className="w-full">
                  Donate Online
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                  <Building className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bank Transfer</h3>
                <p className="text-muted-foreground mb-4">
                  Direct transfer to our account
                </p>
                <Link href="#bank-details">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-hover text-center">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Monthly Giving</h3>
                <p className="text-muted-foreground mb-4">
                  Become a sustaining supporter
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tax Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <div className="p-8 md:p-12 bg-linear-to-r from-primary/5 to-secondary/5">
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Tax Benefits Under 80G</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    All donations to Agraani Welfare Foundation are eligible for tax deduction under Section 80G of the Income Tax Act. You can claim up to 50% of your donation as a deduction from your taxable income.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    80G Registration No: AAAA1234B | Valid from FY 2023-24 onwards
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions About <span className="text-gradient-primary">Donating?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team is here to help. Reach out anytime for assistance or more information.
          </p>
          <Link href="/contact">
            <Button size="lg" className="btn-gradient-primary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
