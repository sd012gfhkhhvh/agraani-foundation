import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { AdminProviders } from '@/components/admin/AdminProviders';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user as any).role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <SessionProvider session={session}>
      <AdminProviders>
        <AdminLayoutShell user={session.user} userRole={userRole} isSuperAdmin={isSuperAdmin}>
          {children}
        </AdminLayoutShell>
      </AdminProviders>
    </SessionProvider>
  );
}
