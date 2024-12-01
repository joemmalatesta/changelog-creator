import { db } from "./drizze";
import { eq } from "drizzle-orm";
import { users, changelogs, changelogEntries, changelogVersions } from "./schema";

export async function getOrCreateUser(email: string) {
	// Check if user exists
	const existingUser = await db.select().from(users).where(eq(users.email, email));

	// If user exists, return the first match
	if (existingUser.length > 0) {
		return existingUser[0];
	}

	// If no user found, create new user
	const newUser = await db
		.insert(users)
		.values({
			id: crypto.randomUUID(),
			email: email,
			createdAt: new Date(),
		})
		.returning();

	return newUser[0];
}

// CRUD for entries
export async function createChangelogEntry(changelogEntry: string, changelogVersionId: string) {
	await db.insert(changelogEntries).values({
		id: crypto.randomUUID(),
		content: changelogEntry,
		changelogVersionId: changelogVersionId,
	});
}

export async function getChangelogEntries(changelogVersionId: string) {
	return await db.select().from(changelogEntries).where(eq(changelogEntries.changelogVersionId, changelogVersionId));
}

export async function editChangelogEntry(id: string, changelogEntry: string) {
	await db
		.update(changelogEntries)
		.set({
			content: changelogEntry,
		})
		.where(eq(changelogEntries.id, id));
}

// CRUD for versions
export async function createChangelogVersion(changelogVersion: string, changelogRepoId: number) {
	const id = crypto.randomUUID();
	await db.insert(changelogVersions).values({
		id: id,
		title: changelogVersion,
		changelogRepoId: changelogRepoId,
	});
	return id;
}

export async function getChangelogVersions(changelogRepoId: number) {
	return await db.select().from(changelogVersions).where(eq(changelogVersions.changelogRepoId, changelogRepoId));
}

export async function editChangelogVersion(id: string, changelogVersion: string) {
	await db
		.update(changelogVersions)
		.set({
			title: changelogVersion,
		})
		.where(eq(changelogVersions.id, id));
}

// CRUD for changelogs
export async function createOrGetChangelog(userEmail: string, publicSlug: string, repoId: number) {
	const existingChangelog = await db.select().from(changelogs).where(eq(changelogs.repoId, repoId));
	if (existingChangelog.length > 0) {
		return existingChangelog[0];
	}
	await db.insert(changelogs).values({
		repoId: repoId,
		userEmail: userEmail,
		publicSlug: publicSlug,
	});
}

export async function getChangelogs(userEmail: string) {
	return await db.select().from(changelogs).where(eq(changelogs.userEmail, userEmail));
}

export async function getChangelogByPublicSlug(publicSlug: string) {
	return await db.select().from(changelogs).where(eq(changelogs.publicSlug, publicSlug));
}
