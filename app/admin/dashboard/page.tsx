import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Image,
  ImageIcon,
  LayoutDashboard,
  Mail,
  Newspaper,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Get comprehensive counts for dashboard stats
  const [
    programsCount,
    activeProgramsCount,
    blogPostsCount,
    publishedBlogsCount,
    galleryCount,
    unreadContactSubmissions,
    totalContactSubmissions,
    teamMembersCount,
    objectivesCount,
    heroBannersCount,
  ] = await Promise.all([
    prisma.program.count(),
    prisma.program.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.galleryItem.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.contactSubmission.count(),
    prisma.teamMember.count(),
    prisma.objective.count(),
    prisma.heroBanner.count(),
  ]);

  const hasUnreadMessages = unreadContactSubmissions > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2 tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome back,{' '}
            <span className="font-semibold text-foreground">
              {session.user.name || session.user.email}
            </span>
            . Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border shadow-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Alert for Unread Messages */}
      {hasUnreadMessages && (
        <Card className="border-l-4 border-l-primary bg-primary/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  You have {unreadContactSubmissions} unread message
                  {unreadContactSubmissions !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  New contact submissions are waiting for your review
                </p>
              </div>
              <Link href="/admin/contact-submissions">
                <Button size="sm" className="btn-gradient-primary shadow-md">
                  View Messages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Programs Stat */}
        <Link href="/admin/programs">
          <Card className="hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/20 group cursor-pointer overflow-hidden relative bg-card">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase className="h-24 w-24 text-primary transform translate-x-8 -translate-y-8" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{programsCount}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">Programs</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium bg-primary/10 w-fit px-2.5 py-1 rounded-full text-primary border border-primary/20">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{activeProgramsCount} active</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Blog Posts Stat */}
        <Link href="/admin/blog">
          <Card className="hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-secondary/20 group cursor-pointer overflow-hidden relative bg-card">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Newspaper className="h-24 w-24 text-secondary transform translate-x-8 -translate-y-8" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-secondary/20">
                  <Newspaper className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{blogPostsCount}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">Blog Posts</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium bg-secondary/10 w-fit px-2.5 py-1 rounded-full text-secondary border border-secondary/20">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{publishedBlogsCount} published</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Gallery Stat */}
        <Link href="/admin/gallery">
          <Card className="hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-accent/20 group cursor-pointer overflow-hidden relative bg-card">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ImageIcon className="h-24 w-24 text-accent transform translate-x-8 -translate-y-8" />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-accent/20">
                  <ImageIcon className="h-6 w-6 text-accent" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">{galleryCount}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">Media Items</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium bg-accent/10 w-fit px-2.5 py-1 rounded-full text-accent border border-accent/20">
                <Image className="h-3.5 w-3.5" />
                <span>Photos & Videos</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Messages Stat */}
        <Link href="/admin/contact-submissions">
          <Card
            className={`hover:shadow-lg transition-all duration-300 border-muted/60 hover:border-primary/20 group cursor-pointer overflow-hidden relative bg-card ${hasUnreadMessages ? 'ring-2 ring-primary/20' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail
                className={`h-24 w-24 transform translate-x-8 -translate-y-8 ${hasUnreadMessages ? 'text-primary' : 'text-muted-foreground'}`}
              />
            </div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 border ${hasUnreadMessages ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'}`}
                >
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">
                    {totalContactSubmissions}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">Messages</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium">
                {hasUnreadMessages ? (
                  <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{unreadContactSubmissions} unread</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full border border-green-500/20">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>All read</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/team">
          <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-muted/60 hover:border-indigo-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:scale-110 transition-transform duration-300 text-indigo-600 border border-indigo-100">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{teamMembersCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/objectives">
          <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-muted/60 hover:border-cyan-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-cyan-50 rounded-lg group-hover:scale-110 transition-transform duration-300 text-cyan-600 border border-cyan-100">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{objectivesCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Objectives</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/hero-banners">
          <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-muted/60 hover:border-pink-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-pink-50 rounded-lg group-hover:scale-110 transition-transform duration-300 text-pink-600 border border-pink-100">
                  <Image className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{heroBannersCount}</div>
                  <div className="text-sm text-muted-foreground font-medium">Hero Banners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card className="border-muted/60 shadow-sm">
        <CardHeader className="border-b bg-muted/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/hero-banners"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-pink-50 text-pink-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <Image className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Manage Hero Banners
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Update homepage carousel</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>

            <Link
              href="/admin/blog"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Create Blog Post
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Share news and updates</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>

            <Link
              href="/admin/programs"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Manage Programs
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Add or edit offerings</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>

            <Link
              href="/admin/team"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Manage Team
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Update team members</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Update Gallery
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Add photos and videos</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>

            <Link
              href="/admin/about"
              className="group p-4 border border-muted rounded-xl hover:border-primary/30 hover:shadow-md hover:bg-primary/5 transition-all duration-200 bg-card"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-white group-hover:text-primary transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate">
                    Edit About Content
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">Update organization info</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
