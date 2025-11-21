import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Protect admin routes
      if (pathname.startsWith('/admin')) {
        const isAuthenticated = !!auth?.user;
        const userRole = (auth?.user as any)?.role;
        const hasAdminAccess = ['SUPER_ADMIN', 'CONTENT_ADMIN', 'EDITOR'].includes(userRole);

        return isAuthenticated && hasAdminAccess;
      }

      // Allow all other routes
      return true;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
});
