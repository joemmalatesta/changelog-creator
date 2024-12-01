import { createChangelogVersion } from "@/db/actions";
import { Commit } from "@/types/repo";
import { redirect } from "next/navigation";

export async function createChangelog(formData: FormData, repoName: string) {
    const commits = JSON.parse(formData.get("commits") as string) as Commit[];
    const title = formData.get("title") as string; 
    const response = await fetch('/api/changelogVersion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, repoName })
    });
    const { changelogVersionId } = await response.json();
    return { commits, title, changelogVersionId };
}

export async function resetRepo() {
	redirect("/");
}
