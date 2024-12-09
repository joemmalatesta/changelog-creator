import { db } from "../drizze";
import { eq } from "drizzle-orm";
import { changelogs, changelogVersions } from "../schema";

export async function createChangelogVersion(title: string, repoName: string, startDate: Date, endDate: Date) {
    "use server";
    const changelog = await db.select().from(changelogs).where(eq(changelogs.repoName, repoName));
    const id = crypto.randomUUID();
    if (!changelog || changelog.length === 0) {
        throw new Error(`No changelog found for repo: ${repoName}`);
    }

    try {
        await db.insert(changelogVersions).values({
            id,
            title,
            changelogId: changelog[0].id,
            startDate: new Date(startDate).toLocaleDateString('en-US'),
            endDate: new Date(endDate).toLocaleDateString('en-US'),
        });
    } catch (error) {
        console.error('Failed to create changelog version:', error);
        throw new Error('Failed to create changelog version');
    }
    return id;
}

export async function getChangelogVersions(changelogId: string) {
    return await db.select().from(changelogVersions).where(eq(changelogVersions.changelogId, changelogId));
}

export async function editChangelogVersionTitle(id: string, title: string) {
    await db
        .update(changelogVersions)
        .set({
            title: title,
        })
        .where(eq(changelogVersions.id, id));
} 