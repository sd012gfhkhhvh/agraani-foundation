'use client';

import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { showPromiseToast } from '@/lib/toast-utils';
import { cn } from '@/lib/utils';
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Scale,
  Settings,
  Target,
  Users,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

interface AdminSidebarProps {
  user: any;
  userRole: string;
  isSuperAdmin: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function AdminSidebar({
  user,
  userRole,
  isSuperAdmin,
  isCollapsed,
  toggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const filteredNav = navigation.filter((item) => !item.requireSuperAdmin || isSuperAdmin);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await showPromiseToast(signOut({ redirect: false }), {
        loading: 'Logging out...',
        success: 'Logged out successfully!',
        error: 'Failed to log out.',
      });
      window.location.href = '/login';
      setIsLogoutDialogOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('p-6 border-b border-border', isCollapsed ? 'px-4' : 'px-6')}>
        <Link href="/admin/dashboard" className="block group">
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-primary/20 shrink-0">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold tracking-tight text-foreground">Agraani CMS</h1>
                <p className="text-xs text-muted-foreground font-medium">Content Management</p>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform',
                    !isActive && 'group-hover:scale-110',
                    isActive && 'scale-105'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        {!isCollapsed ? (
          <div className="mb-3 px-4 py-3 bg-muted/50 rounded-xl border border-border animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold truncate max-w-[100px] text-foreground">
                {user.name || 'Admin'}
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                {userRole}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        ) : (
          <div className="mb-3 flex justify-center">
            <div
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold border border-border"
              title={user.name || 'Admin'}
            >
              {user.name?.[0] || 'A'}
            </div>
          </div>
        )}

        <Button
          variant="destructive"
          className={cn(
            'w-full transition-colors duration-200',
            isCollapsed ? 'justify-center px-0' : 'justify-start px-4'
          )}
          onClick={() => setIsLogoutDialogOpen(true)}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className={cn('h-4 w-4 shrink-0', !isCollapsed && 'mr-3')} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden lg:block fixed inset-y-0 left-0 bg-card border-r border-border transition-all duration-300 z-40',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <NavContent />
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-8 h-8 w-8 rounded-full border border-border bg-background shadow-sm hover:bg-accent hidden lg:flex"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ConfirmDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out of the admin panel?"
        confirmText="Logout"
        variant="destructive"
        isLoading={isLoggingOut}
        loadingText="Logging out..."
      />
    </>
  );
}
