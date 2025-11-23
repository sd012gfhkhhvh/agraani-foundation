import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { AdminProviders } from '@/components/admin/AdminProviders';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = session.user;

  const userRole = user.role || 'VIEWER';
  console.log('user role (from db): ', userRole);

  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <SessionProvider session={session}>
      <AdminProviders>
        <AdminLayoutShell user={user} userRole={userRole} isSuperAdmin={isSuperAdmin}>
          {children}
        </AdminLayoutShell>
      </AdminProviders>
    </SessionProvider>
  );
}
