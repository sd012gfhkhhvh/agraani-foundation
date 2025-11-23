import { ConstructionBanner } from '@/components/public/construction-banner';
import { Footer } from '@/components/public/footer';
import { Header } from '@/components/public/header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConstructionBanner />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
