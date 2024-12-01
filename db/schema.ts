import { pgTable, text, uuid, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changelogs = pgTable("changelogs", {
	id: uuid("id").primaryKey().defaultRandom(),
	repoId: integer("repo_id").notNull().unique(), // repoId
	userEmail: text("user_email")
		.references(() => users.email)
		.notNull(),
	publicSlug: text("public_slug").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changelogVersions = pgTable("changelog_versions", {
	id: uuid("id").primaryKey().defaultRandom(),
	changelogRepoId: integer("changelog_repo_id")
		.references(() => changelogs.repoId)
		.notNull(),
	title: text("title").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changelogEntries = pgTable("changelog_entries", {
	id: uuid("id").primaryKey(), // commit sha
	changelogVersionId: uuid("changelog_version_id")
		.references(() => changelogVersions.id)
		.notNull(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
