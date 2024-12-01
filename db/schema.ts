import { pgTable, text, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const changelogs = pgTable('changelogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  publicSlug: text('public_slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const changelogVersions = pgTable('changelog_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  changelogId: uuid('changelog_id').references(() => changelogs.id).notNull(),
  versionNumber: text('version_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const changelogEntries = pgTable('changelog_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  changelogVersionId: uuid('changelog_version_id').references(() => changelogVersions.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
