import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [Google],
  basePath: '/auth',
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === 'update') token.name = session.user.name;

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
