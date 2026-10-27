import { index, snakeCase, text, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './organizations';
import { users } from './users';
import { createId } from '@paralleldrive/cuid2';

export const invitations = snakeCase.table(
  'invitations',
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text()
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    inviterId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    role: text(),
    status: text().default('pending').notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (table) => [
    index('invitations_organizationId_idx').on(table.organizationId),
    index('invitations_email_idx').on(table.email),
  ],
);
