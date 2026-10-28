import { betterAuth } from 'better-auth';
import { organization, openAPI, oauthPopup, bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/infra/database';
import * as schema from '@/infra/database/schemas';

export const auth = betterAuth({
  basePath: '/api/auth',
  baseURL: 'http://localhost:3000',
  trustedOrigins: ['http://localhost:5173'],
  plugins: [organization(), openAPI(), oauthPopup(), bearer()],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),
  advanced: {
    database: {
      generateId: false,
    },
    disableOriginCheck: true,
  },
  account: {
    encryptOAuthTokens: true,
  },
  user: {
    additionalFields: {
      githubLogin: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ['read:user', 'user:email'],
      mapProfileToUser: (profile) => ({ githubLogin: profile.login }),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});
