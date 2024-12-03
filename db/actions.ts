import { db } from "./drizze";
import { eq } from "drizzle-orm";
import { users, changelogs, changelogEntries, changelogVersions } from "./schema";

async function withRetry<T>(
	operation: () => Promise<T>,
	retries = 3,
	delay = 1000
): Promise<T> {
	for (let i = 0; i < retries; i++) {
		try {
			return await operation();
		} catch (error) {
			if (i === retries - 1) throw error;
			console.warn(`Database operation failed, attempt ${i + 1} of ${retries}:`, error);
			await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
		}
	}
	throw new Error('Retry failed'); // TypeScript requires this
}

export async function getOrCreateUser(email: string) {
	return withRetry(async () => {
		const existingUser = await db.select().from(users).where(eq(users.email, email));

		if (existingUser.length > 0) {
			return existingUser[0];
		}

		const newUser = await db
			.insert(users)
			.values({
				id: crypto.randomUUID(),
				email: email,
				createdAt: new Date(),
			})
			.returning();

		return newUser[0];
	});
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
	return withRetry(async () => {
		const existingChangelog = await db.select().from(changelogs).where(eq(changelogs.repoName, repoName));
		if (existingChangelog.length > 0) {
			return existingChangelog[0];
		}
		return await db.insert(changelogs).values({
			repoName: repoName,
			userEmail: userEmail,
			publicSlug: publicSlug,
		});
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
