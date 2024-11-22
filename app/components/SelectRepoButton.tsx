"use client";
import { useState } from "react";
import { Repository, Commit, PullRequest } from "@/types/repo";

interface RepoData {
	pullRequests: PullRequest[];
	commits: Commit[];
}

export default function SelectRepoButton({ repos, formAction }: { repos: Repository[]; formAction: (formData: FormData) => Promise<RepoData> }) {
	const [repoData, setRepoData] = useState<RepoData | null>(null);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

	async function handleSubmit(formData: FormData) {
		const repo: Repository = JSON.parse(formData.get("repo") as string);
		if (!repo) return;
		const data = await formAction(formData);
		setRepoData(data);
	}

	return (
		<main>
			{!repoData && (
				<div>
					<input
				className="w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-700 placeholder:text-dark/50 dark:placeholder:text-light/50"
					type="text"
					placeholder="Filter repositories..."
					onChange={(e) => {
						const filter = e.target.value.toLowerCase();
						const buttons = e.target.parentElement?.querySelectorAll("button");
						buttons?.forEach((button) => {
							const text = button.textContent?.toLowerCase() || "";
							button.style.display = text.includes(filter) ? "" : "none";
						});
					}}
				/>
				<div className="flex flex-col max-h-60 overflow-y-auto items-start">
					{repos.map((repo) => (
						<form key={repo.id} action={handleSubmit} className="w-full hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md ">
							<input type="hidden" name="repo" value={JSON.stringify(repo)} />
							<button type="submit" onClick={() => setSelectedRepo(repo)} className="w-full text-start p-2">
								{repo.name}
							</button>
						</form>
						))}
					</div>
				</div>
			)}

			{repoData && (
				<div>
                    <div className="flex gap-1 items-center mb-2">
						<button onClick={() => setRepoData(null)}>
							<svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1a1a1a" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
							<svg className="dark:block hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
						</button>
						<h2 className="text-2xl font-bold">{selectedRepo?.name}</h2>
					</div>
                    {repoData.pullRequests.length > 0 ? (
						<div>
							<h2 className="text-xl font-semibold">Pull Requests</h2>
							<ul>
							{repoData.pullRequests.map((pr) => (
								<li key={pr.id}>
								#{pr.number} - {pr.title} ({pr.state})
							</li>
							))}
							</ul>
						</div>
					) : (
						<p className="opacity-50">No pull requests</p>
					)}

					{repoData.commits.length > 0 ? (
						<div>
							<h2 className="text-xl font-semibold">Commits</h2>
							<ul>
								{repoData.commits.map((commit) => (
							<li key={commit.sha}>
								{commit.sha.substring(0, 7)} - {commit.commit.message}
							</li>
						))}
							</ul>
						</div>
					) : (
						<p className="opacity-50">No commits</p>
					)}
				</div>
			)}
		</main>
	);
}
