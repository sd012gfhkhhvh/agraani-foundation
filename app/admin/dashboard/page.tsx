import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  Image, 
  Newspaper, 
  Mail, 
  LayoutDashboard,
  Briefcase,
  Target,
  ImageIcon,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Hello, <span className="font-semibold text-gray-900">{session.user.name || session.user.email}</span>! Here's your overview.
        </p>
      </div>

      {/* Alert for Unread Messages */}
      {hasUnreadMessages && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  You have {unreadContactSubmissions} unread message{unreadContactSubmissions !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-600">New contact submissions are waiting for your review</p>
              </div>
              <Link href="/admin/contact-submissions">
                <Button size="sm" className="btn-gradient-primary">
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
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{programsCount}</div>
                  <div className="text-sm text-gray-500 mt-1">Total Programs</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">{activeProgramsCount} active</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Blog Posts Stat */}
        <Link href="/admin/blog">
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                  <Newspaper className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{blogPostsCount}</div>
                  <div className="text-sm text-gray-500 mt-1">Blog Posts</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">{publishedBlogsCount} published</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Gallery Stat */}
        <Link href="/admin/gallery">
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-primary group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{galleryCount}</div>
                  <div className="text-sm text-gray-500 mt-1">Media Items</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Image className="h-4 w-4 text-gray-600" />
                <span className="text-gray-600">Photos & Videos</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Messages Stat */}
        <Link href="/admin/contact-submissions">
          <Card className={`hover:shadow-lg transition-all duration-200 border-2 hover:border-primary group cursor-pointer ${hasUnreadMessages ? 'border-primary bg-primary/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${hasUnreadMessages ? 'bg-primary/20' : 'bg-amber-100'}`}>
                  <Mail className={`h-6 w-6 ${hasUnreadMessages ? 'text-primary' : 'text-amber-600'}`} />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{totalContactSubmissions}</div>
                  <div className="text-sm text-gray-500 mt-1">Messages</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {hasUnreadMessages ? (
                  <>
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-primary font-medium">{unreadContactSubmissions} unread</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">All read</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/team">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{teamMembersCount}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/objectives">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyan-100 rounded-lg group-hover:scale-110 transition-transform">
                  <Target className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{objectivesCount}</div>
                  <div className="text-sm text-gray-600">Objectives</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/hero-banners">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-pink-100 rounded-lg group-hover:scale-110 transition-transform">
                  <Image className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{heroBannersCount}</div>
                  <div className="text-sm text-gray-600">Hero Banners</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/hero-banners"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <Image className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Manage Hero Banners</h3>
                  <p className="text-sm text-gray-600">Update homepage carousel</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/blog"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <Newspaper className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Create Blog Post</h3>
                  <p className="text-sm text-gray-600">Share news and updates</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/programs"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Manage Programs</h3>
                  <p className="text-sm text-gray-600">Add or edit offerings</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/team"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Manage Team</h3>
                  <p className="text-sm text-gray-600">Update team members</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Update Gallery</h3>
                  <p className="text-sm text-gray-600">Add photos and videos</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              href="/admin/about"
              className="group p-5 border-2 border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all duration-200 bg-linear-to-br from-white to-gray-50"
            >
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">Edit About Content</h3>
                  <p className="text-sm text-gray-600">Update organization info</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
