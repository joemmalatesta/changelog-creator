import { Commit } from "@/types/repo";
import { redirect } from "next/navigation";

export async function createChangelog(formData: FormData, repoName: string) {
    const commits = JSON.parse(formData.get("commits") as string) as Commit[];
    const title = formData.get("title") as string;
    const startDate = commits[commits.length - 1].commit.author.date;
    const endDate = commits[0].commit.author.date;
    const response = await fetch('/api/changelogVersion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, repoName, startDate, endDate })
    });
    const { changelogVersionId } = await response.json();
    return { commits, title, changelogVersionId };
}

export async function resetRepo() {
	redirect("/");
}
