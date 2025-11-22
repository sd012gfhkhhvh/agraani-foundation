'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AdminLayoutShellProps {
  children: React.ReactNode;
  user: any;
  userRole: string;
  isSuperAdmin: boolean;
}

export function AdminLayoutShell({
  children,
  user,
  userRole,
  isSuperAdmin,
}: AdminLayoutShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync with sidebar state (this is a bit of a hack, ideally lift state up)
  // But since AdminSidebar manages its own state in localStorage, we can just read it here too
  // or pass a callback. Let's pass a callback.

  // Actually, better to control the state here.

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved) setIsSidebarCollapsed(JSON.parse(saved));
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        user={user}
        userRole={userRole}
        isSuperAdmin={isSuperAdmin}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />

      <div
        className={cn(
          'min-h-screen flex flex-col transition-all duration-300',
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <header className="bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-border">
          <div className="px-4 sm:px-8 py-4">
            <div className="flex items-center justify-between ml-10 lg:ml-0">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Welcome back,{' '}
                <span className="font-semibold text-foreground">{user.name || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-input rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View Website</span>
                </Link>
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
