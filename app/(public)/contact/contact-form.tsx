'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Message sent successfully! We will get back to you soon.');
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Your Name *
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            placeholder="John Doe"
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder="john@example.com"
            className="w-full"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Phone Number
        </label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="+91 XXXXX XXXXX"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject *
        </label>
        <Input
          type="text"
          id="subject"
          name="subject"
          required
          placeholder="How can we help?"
          className="w-full"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us more about your inquiry..."
          className="w-full resize-none"
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full btn-gradient-primary text-lg py-6"
        disabled={isSubmitting}
      >
        <Send className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
