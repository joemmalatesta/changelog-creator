import { pgTable, text, uuid, timestamp, boolean, integer, date } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changelogs = pgTable("changelogs", {
	id: uuid("id").primaryKey().defaultRandom(),
	repoName: text("repo_name").notNull(),
	userEmail: text("user_email")
		.references(() => users.email)
		.notNull(),
	publicSlug: text("public_slug").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	// Would add initial commit here to compare.
});

export const changelogVersions = pgTable("changelog_versions", {
	id: uuid("id").primaryKey().defaultRandom(),
	changelogId: uuid("changelog_id")
		.references(() => changelogs.id)
		.notNull(),
	title: text("title").notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changelogEntries = pgTable("changelog_entries", {
	id: uuid("id").primaryKey(), // commit sha
	changelogVersionId: uuid("changelog_version_id")
		.references(() => changelogVersions.id)
		.notNull(),
	type: text("type").notNull(), // "title", "feature", "bugfix", "improvement", "breakingChange", "link"
	content: text("content"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
