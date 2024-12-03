import { db } from "../drizze";
import { eq } from "drizzle-orm";
import { changelogEntries } from "../schema";

export async function saveChangelogEntry(type: string, changelogEntry: string, changelogVersionId: string, id?: string) {
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
            type: type,
            content: changelogEntry, 
            changelogVersionId: changelogVersionId,
        });
    }
}

export async function getChangelogEntries(changelogVersionId: string) {
    return await db.select().from(changelogEntries).where(eq(changelogEntries.changelogVersionId, changelogVersionId));
} 