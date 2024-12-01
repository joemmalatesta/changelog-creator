import { db } from './drizze'
import { eq } from 'drizzle-orm'
import { users, changelogs, changelogEntries, changelogVersions } from './schema'

export async function getOrCreateUser(email: string) {
	// Check if user exists
	const existingUser = await db.select().from(users).where(eq(users.email, email))

	// If user exists, return the first match
	if (existingUser.length > 0) {
		return existingUser[0]
	}

	// If no user found, create new user
	const newUser = await db.insert(users).values({
        id: crypto.randomUUID(),
		email: email,
		createdAt: new Date()
	}).returning()

	return newUser[0]
}


// CRUD for entries
export async function createChangelogEntry(changelogEntry: string, changelogVersionId: string) {
	await db.insert(changelogEntries).values({
		id: crypto.randomUUID(),
		content: changelogEntry,
		changelogVersionId: changelogVersionId,
	})
}

export async function getChangelogEntries(changelogVersionId: string) {
	return await db.select().from(changelogEntries).where(eq(changelogEntries.changelogVersionId, changelogVersionId))
}

export async function editChangelogEntry(id: string, changelogEntry: string) {
	await db.update(changelogEntries).set({
		content: changelogEntry,
	}).where(eq(changelogEntries.id, id))
}


// CRUD for versions
export async function createChangelogVersion(changelogVersion: string, changelogId: string) {
	await db.insert(changelogVersions).values({
		id: crypto.randomUUID(),
		versionNumber: changelogVersion,
		changelogId: changelogId,
	})
}


export async function getChangelogVersions(changelogId: string) {
	return await db.select().from(changelogVersions).where(eq(changelogVersions.changelogId, changelogId))
}

export async function editChangelogVersion(id: string, changelogVersion: string) {
	await db.update(changelogVersions).set({
		versionNumber: changelogVersion,
	}).where(eq(changelogVersions.id, id))
}


// CRUD for changelogs
export async function createChangelog(userId: string, publicSlug: string) {
	await db.insert(changelogs).values({
		id: crypto.randomUUID(),
		userId: userId,
		publicSlug: publicSlug,
	})
}

export async function getChangelogs(userId: string) {
	return await db.select().from(changelogs).where(eq(changelogs.userId, userId))
}



