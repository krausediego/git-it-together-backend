import { index, snakeCase, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { createId } from '@paralleldrive/cuid2';

export const accounts = snakeCase.table(
  'accounts',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (table) => [index('accounts_userId_idx').on(table.userId)],
);
