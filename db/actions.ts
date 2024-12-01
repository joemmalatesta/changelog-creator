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
export async function saveChangelogEntry(changelogEntry: string, changelogVersionId: string, id?: string) {
	if (id) {
		await db
			.update(changelogEntries)
			.set({
				content: changelogEntry,
			})
			.where(eq(changelogEntries.id, id));
	} else {
		await db.insert(changelogEntries).values({
			id: crypto.randomUUID(),
			content: changelogEntry, 
			changelogVersionId: changelogVersionId,
		});
	}
}


export async function getChangelogEntries(changelogVersionId: string) {
	return await db.select().from(changelogEntries).where(eq(changelogEntries.changelogVersionId, changelogVersionId));
}

// CRUD for versions
export async function createChangelogVersion(title: string, repoName: string) {
	console.log(repoName);
	const changelog = await db.select().from(changelogs).where(eq(changelogs.repoName, repoName));
	console.log(changelog);
	const id = crypto.randomUUID();
	await db.insert(changelogVersions).values({
		id,
		title,
		changelogId: changelog[0].id,
	});
	return id;
}

export async function getChangelogVersions(changelogId: string) {
	return await db.select().from(changelogVersions).where(eq(changelogVersions.changelogId, changelogId));
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
export async function createOrGetChangelog(userEmail: string, publicSlug: string, repoName: string) {
	const existingChangelog = await db.select().from(changelogs).where(eq(changelogs.repoName, repoName));
	if (existingChangelog.length > 0) {
		return existingChangelog[0];
	}
	await db.insert(changelogs).values({
		repoName: repoName,
		userEmail: userEmail,
		publicSlug: publicSlug,
	});
}

export async function getChangelogs(userEmail: string) {
	return await db.select().from(changelogs).where(eq(changelogs.userEmail, userEmail));
}

export async function getChangelogByPublicSlug(publicSlug: string) {
	console.log(publicSlug);
	return await db.select({
		id: changelogVersions.id,
		title: changelogVersions.title,
	}).from(changelogs).innerJoin(changelogVersions, eq(changelogs.id, changelogVersions.changelogId)).where(eq(changelogs.publicSlug, publicSlug));
}
