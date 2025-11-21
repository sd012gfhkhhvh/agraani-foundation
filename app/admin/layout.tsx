import { Badge } from '@/components/ui/badge';
import { auth, signOut } from '@/lib/auth';
import { getRoleBadgeColor, getRoleDisplayName } from '@/lib/permissions';
import {
  Briefcase,
  ExternalLink,
  FileText,
  Image,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Scale,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Toaster } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Hero Banners', href: '/admin/hero-banners', icon: Image },
  { name: 'About Content', href: '/admin/about', icon: FileText },
  { name: 'Programs', href: '/admin/programs', icon: Briefcase },
  { name: 'Objectives', href: '/admin/objectives', icon: Target },
  { name: 'Legal Documents', href: '/admin/legal', icon: Scale },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Blog Posts', href: '/admin/blog', icon: Newspaper },
  { name: 'Contact Submissions', href: '/admin/contact-submissions', icon: Mail },
  { name: 'Users', href: '/admin/users', icon: Settings, requireSuperAdmin: true },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user as any).role;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const filteredNav = navigation.filter((item) => !item.requireSuperAdmin || isSuperAdmin);

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Enhanced Sidebar */}
        <div className="fixed inset-y-0 left-0 w-72 bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 text-white shadow-2xl">
          <div className="flex flex-col h-full">
            {/* Logo & Branding */}
            <div className="p-6 border-b border-gray-800/50">
              <Link href="/admin/dashboard" className="block group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Agraani CMS</h1>
                    <p className="text-xs text-gray-400">Content Management</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="relative z-10 font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-800/50 bg-gray-950/50">
              <div className="mb-3 px-4 py-3 bg-gray-800/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-white truncate">
                    {session.user.name || 'Admin'}
                  </div>
                  <Badge className={getRoleBadgeColor(userRole)} variant="outline">
                    {getRoleDisplayName(userRole)}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400 truncate">{session.user.email}</div>
              </div>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 w-full border border-gray-800 hover:border-red-600/50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-72">
          {/* Top Header Bar */}
          <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Welcome back,{' '}
                  <span className="font-semibold text-gray-900">
                    {session.user.name || 'Admin'}
                  </span>
                </div>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-primary transition-all duration-200 shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Website
                </Link>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-8">{children}</main>
        </div>

        <Toaster richColors position="top-right" />
      </div>
    </SessionProvider>
  );
}
