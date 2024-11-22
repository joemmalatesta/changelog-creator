"use client";
import { useEffect, useState } from "react";
import { Repository, Commit, PullRequest } from "@/types/repo";

interface RepoData {
	pullRequests: PullRequest[];
	commits: Commit[];
}

function isCommit(item: Commit | PullRequest): item is Commit {
	return 'sha' in item;
}

export default function SelectRepoButton({ repos, formAction }: { repos: Repository[]; formAction: (formData: FormData) => Promise<RepoData> }) {
	const [repoData, setRepoData] = useState<RepoData | null>(null);
	const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
	const [commitOrPullRequest, setCommitOrPullRequest] = useState<"commits" | "pullRequests">("commits");
	const [rangeStart, setRangeStart] = useState<Commit | PullRequest | null>(null);
	const [rangeEnd, setRangeEnd] = useState<Commit | PullRequest | null>(null);
	const [commitsBetween, setCommitsBetween] = useState<number | null>(null);
	const [pullRequestsBetween, setPullRequestsBetween] = useState<number | null>(null);

	async function handleSubmit(formData: FormData) {
		const data = await formAction(formData);
		setRepoData(data);
	}

	const calculateLastUpdated = (lastUpdated: Date) => {
		const today = new Date();
		const diffTime = today.getTime() - lastUpdated.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffMonths = Math.floor(diffDays / 30);

		if (diffDays === 0) {
			return "today";
		} else if (diffDays < 30) {
			return `${diffDays}d`;
		} else {
			return `${diffMonths}mo`;
		}
	};

	useEffect(() => {
		if (rangeStart && rangeEnd) {
			const items = repoData?.[commitOrPullRequest] || [];
			const startIndex = items.findIndex(item => 
				isCommit(item) ? item.sha === (rangeStart as Commit).sha : item.id === (rangeStart as PullRequest).id
			);
			const endIndex = items.findIndex(item => 
				isCommit(item) ? item.sha === (rangeEnd as Commit).sha : item.id === (rangeEnd as PullRequest).id
			);
			
			if (startIndex !== -1 && endIndex !== -1) {
				const count = (Math.abs(endIndex - startIndex) + 1);
				if (commitOrPullRequest === "commits") {
					setCommitsBetween(count);
					setPullRequestsBetween(null);
				} else {
					setPullRequestsBetween(count);
					setCommitsBetween(null);
				}
			}
		} else {
			setCommitsBetween(null);
			setPullRequestsBetween(null);
		}
	}, [rangeStart, rangeEnd, commitOrPullRequest, repoData]);

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
						<button onClick={() => {setRepoData(null); setRangeStart(null); setRangeEnd(null);}}>
							<svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1a1a1a" viewBox="0 0 256 256">
								<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
							</svg>
							<svg className="dark:block hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
								<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
							</svg>
						</button>
						<h2 className="text-2xl font-bold">{selectedRepo?.name}</h2>
					</div>
					<div className="flex gap-1 mb-1">
						<button
							onClick={() => {setCommitOrPullRequest("commits"); setRangeStart(null); setRangeEnd(null);}}
							className={`${commitOrPullRequest === "commits" ? "bg-neutral-200 dark:bg-neutral-800" : ""} rounded-md p-2`}
						>
							Commits
						</button>
						<button
							onClick={() => {setCommitOrPullRequest("pullRequests"); setRangeStart(null); setRangeEnd(null);}}
							className={`${commitOrPullRequest === "pullRequests" ? "bg-neutral-200 dark:bg-neutral-800" : ""} rounded-md p-2`}
						>
							Pull Requests
						</button>
					</div>

					{commitOrPullRequest === "pullRequests" &&
						(repoData.pullRequests.length > 0 ? (
							<div>
								<ul>
									{repoData.pullRequests.map((pr) => (
										<li key={pr.id} className="flex items-center gap-2 p-1">
											<div className="flex gap-2">
												<button
													onClick={() => setRangeStart(pr)}
													className={`px-2 py-1 rounded ${rangeStart === pr ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
												>
													Start
												</button>
												<button
													onClick={() => setRangeEnd(pr)}
													className={`px-2 py-1 rounded ${rangeEnd === pr ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
												>
													End
												</button>
											</div>
											<span>#{pr.number} - {pr.title} ({pr.state})</span>
										</li>
									))}
								</ul>
							</div>
						) : (
							<p className="opacity-50">No Pull Requests</p>
						))}

					{commitOrPullRequest === "commits" &&
						(repoData.commits.length > 0 ? (
							<div>
								<ul className="max-h-96 overflow-y-auto">
									{repoData.commits.map((commit) => (
										<li key={commit.sha} className="w-full flex items-center justify-between p-1">
											<div className="flex items-center gap-2">
												<div className="flex gap-2">
													<button
														onClick={() => setRangeStart(commit)}
														className={`px-2 py-1 rounded ${rangeStart === commit ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
													>
														Start
													</button>
													<button
														onClick={() => setRangeEnd(commit)}
														className={`px-2 py-1 rounded ${rangeEnd === commit ? 'bg-blue-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700'}`}
													>
														End
													</button>
												</div>
												<p className="w-11/12 whitespace-nowrap overflow-hidden text-ellipsis">{commit.commit.message}</p>
											</div>
											<p className="text-sm opacity-50">{calculateLastUpdated(new Date(commit.commit.author.date))}</p>
										</li>
									))}
								</ul>
							</div>
						) : (
							<p className="opacity-50">No commits</p>
						))}

					{(rangeStart || rangeEnd) && (
						<div className="relative mt-4 p-2 rounded h-32 flex flex-col justify-between">
							<div className="absolute left-0 top-2 bottom-0 w-[2px] h-28 bg-neutral-300 dark:bg-neutral-600" />
							{rangeStart && <p>{isCommit(rangeStart) ? rangeStart.commit.message : `#${rangeStart.number} - ${rangeStart.title}`}</p>}
							{(commitsBetween !== null || pullRequestsBetween !== null) && (
								<p className="text-sm text-neutral-500">
									{commitsBetween !== null ? `${commitsBetween} commits` : `${pullRequestsBetween} pull requests`} selected
								</p>
							)}
							{rangeEnd && <p>{isCommit(rangeEnd) ? rangeEnd.commit.message : `#${rangeEnd.number} - ${rangeEnd.title}`}</p>}
							{rangeStart && rangeEnd && ((!isCommit(rangeStart) && isCommit(rangeEnd)) || (isCommit(rangeStart) && !isCommit(rangeEnd))) && (
								<p className="text-red-500 text-sm">Start and end must be the same type</p>
							)}
						</div>
					)}
				</div>
			)}
		</main>
	);
}
