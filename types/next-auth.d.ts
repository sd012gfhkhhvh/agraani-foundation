import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole | null;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    role: UserRole | null;
  }
}
