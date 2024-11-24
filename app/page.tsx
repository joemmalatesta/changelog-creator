"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Commit, Repository } from "@/types/repo";
import { revalidatePath } from "next/cache";
import SelectRepoButton from "./components/SelectRepo";
import SelectRange from "./components/SelectRange";
import ChangelogViewer from "./components/ChangelogViewer";

let selectedRepoName: string | null = null;
let selectedRepoCommits: Commit[] | null = null;
let commitsForChangelog: Commit[] | null = null;
let changelogTitle: string | null = null;

export default async function Home() {
	const session = await getServerSession(authOptions);
	let repos: Repository[] = [];

	// on pageload
	if (session?.access_token) {
		repos = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc", {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		}).then((res) => res.json());
	}

	async function getRepoInformation(repo: Repository) {
		"use server";
		const session = await getServerSession(authOptions);
		if (!session?.access_token) return [];
		const commits: Commit[] = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=100`, {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		}).then((res) => res.json());
		return commits;
	}

	async function selectRepo(formData: FormData) {
		"use server";
		const repoData = JSON.parse(formData.get("repo") as string) as Repository;
		selectedRepoName = repoData.name;
		selectedRepoCommits = await getRepoInformation(repoData);
		revalidatePath("/");
	}

	async function selectRange(formData: FormData) {
		"use server";
        const commits = JSON.parse(formData.get("commits") as string) as Commit[];
        const title = formData.get("title") as string;
        commitsForChangelog = commits;
        changelogTitle = title;
		revalidatePath("/");
	}

	async function resetRepo() {
		"use server";
		selectedRepoCommits = null;
		revalidatePath("/");
	}

	async function publishChangelog(formData: FormData) {
		"use server";
		console.log(formData);
	}

	// Pass both repos and the form action to the client component
	return (
		<main>
            <h1 className="text-2xl font-bold mb-2">Create new changelog</h1>
			{!selectedRepoCommits ? (
				<SelectRepoButton repos={repos} formAction={selectRepo} />
			) : (
		<div>
			<form action={resetRepo} className="flex gap-1 items-center mb-2">
				<button type="submit">
					<svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1a1a1a" viewBox="0 0 256 256">
						<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
					</svg>
					<svg className="dark:block hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
						<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
					</svg>
				</button>
				<h2 className="text-2xl font-bold">{selectedRepoName}</h2>
			</form>
				<SelectRange commits={selectedRepoCommits} formAction={selectRange} />
			</div>
			)}
			{commitsForChangelog && changelogTitle && (
				<div className="flex flex-col items-center">
					<h2 className="text-2xl font-bold">{changelogTitle}</h2>
					<form action={publishChangelog}>
						<button type="submit">Publish</button>
					</form>
					<ChangelogViewer commits={commitsForChangelog} />
				</div>
			)}
		</main>
	);
}
