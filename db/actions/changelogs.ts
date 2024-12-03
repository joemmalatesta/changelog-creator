import { db } from "../drizze";
import { eq } from "drizzle-orm";
import { changelogs, changelogVersions } from "../schema";
import { withRetry } from "../utils";

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
    return await db.select({
        id: changelogVersions.id,
        title: changelogVersions.title,
    })
    .from(changelogs)
    .innerJoin(changelogVersions, eq(changelogs.id, changelogVersions.changelogId))
    .where(eq(changelogs.publicSlug, publicSlug));
} 