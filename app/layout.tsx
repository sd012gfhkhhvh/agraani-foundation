import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agraani Welfare Foundation',
  description:
    'Empowering women and children through education, skill training, and community development in West Bengal, India.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
