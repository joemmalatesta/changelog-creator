import { db } from "../drizze";
import { eq } from "drizzle-orm";
import { changelogEntries } from "../schema";

export async function saveChangelogEntry(type: string, changelogEntry: string, changelogVersionId: string, id?: string) {
    try {
        await db
            .insert(changelogEntries)
            .values({
                id: id || crypto.randomUUID(),
                type: type,
                content: changelogEntry,
                changelogVersionId: changelogVersionId,
            })
            .onConflictDoUpdate({
                target: changelogEntries.id,
                set: {
                    content: changelogEntry,
                }
            });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to save changelog entry: ${error.message}`);
        } else {
            throw new Error('Failed to save changelog entry');
        }
    }
}

export async function getChangelogEntries(changelogVersionId: string) {
    return await db.select().from(changelogEntries).where(eq(changelogEntries.changelogVersionId, changelogVersionId));
} 