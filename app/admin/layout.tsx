import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ThemeProvider } from '@/components/theme-provider';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user as any).role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextTopLoader color="var(--color-primary)" showSpinner={false} />
        <AdminLayoutShell user={session.user} userRole={userRole} isSuperAdmin={isSuperAdmin}>
          {children}
        </AdminLayoutShell>
      </ThemeProvider>
    </SessionProvider>
  );
}
