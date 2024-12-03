"use client";

import { ChangelogEntry } from "@/types/Changelog";
import { Commit } from "@/types/repo";
import { useEffect, useState, useRef } from "react";

const readableTypes = {
	title: "Title",
	feature: "What's New",
	bugfix: "Bug Fixes",
	improvement: "Improvements",
	breakingChange: "Breaking Changes",
	link: "Links",
} as const;

const svgIconsDark = {
	title: <></>,
	feature: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
			<path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></path>
		</svg>
	),
	bugfix: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
			<path d="M144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM100,80a12,12,0,1,0,12,12A12,12,0,0,0,100,80Zm116,64A87.76,87.76,0,0,1,213,167l22.24,9.72A8,8,0,0,1,232,192a7.89,7.89,0,0,1-3.2-.67L207.38,182a88,88,0,0,1-158.76,0L27.2,191.33A7.89,7.89,0,0,1,24,192a8,8,0,0,1-3.2-15.33L43,167A87.76,87.76,0,0,1,40,144v-8H16a8,8,0,0,1,0-16H40v-8a87.76,87.76,0,0,1,3-23L20.8,79.33a8,8,0,1,1,6.4-14.66L48.62,74a88,88,0,0,1,158.76,0l21.42-9.36a8,8,0,0,1,6.4,14.66L213,89.05a87.76,87.76,0,0,1,3,23v8h24a8,8,0,0,1,0,16H216ZM56,120H200v-8a72,72,0,0,0-144,0Zm64,95.54V136H56v8A72.08,72.08,0,0,0,120,215.54ZM200,144v-8H136v79.54A72.08,72.08,0,0,0,200,144Z"></path>
		</svg>
	),
	improvement: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
			<path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31l-56,56V200H224A8,8,0,0,1,232,208Z"></path>
		</svg>
	),
	breakingChange: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
			<path d="M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z"></path>
		</svg>
	),
	link: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
			<path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
		</svg>
	),
};

const svgIconsLight = {
	title: <></>,
	feature: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
			<path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></path>
		</svg>
	),
	bugfix: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
			<path d="M144,92a12,12,0,1,1,12,12A12,12,0,0,1,144,92ZM100,80a12,12,0,1,0,12,12A12,12,0,0,0,100,80Zm116,64A87.76,87.76,0,0,1,213,167l22.24,9.72A8,8,0,0,1,232,192a7.89,7.89,0,0,1-3.2-.67L207.38,182a88,88,0,0,1-158.76,0L27.2,191.33A7.89,7.89,0,0,1,24,192a8,8,0,0,1-3.2-15.33L43,167A87.76,87.76,0,0,1,40,144v-8H16a8,8,0,0,1,0-16H40v-8a87.76,87.76,0,0,1,3-23L20.8,79.33a8,8,0,1,1,6.4-14.66L48.62,74a88,88,0,0,1,158.76,0l21.42-9.36a8,8,0,0,1,6.4,14.66L213,89.05a87.76,87.76,0,0,1,3,23v8h24a8,8,0,0,1,0,16H216ZM56,120H200v-8a72,72,0,0,0-144,0Zm64,95.54V136H56v8A72.08,72.08,0,0,0,120,215.54ZM200,144v-8H136v79.54A72.08,72.08,0,0,0,200,144Z"></path>
		</svg>
	),
	improvement: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
			<path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.69l50.34-50.35a8,8,0,0,1,11.32,0L128,132.69,180.69,80H160a8,8,0,0,1,0-16h40a8,8,0,0,1,8,8v40a8,8,0,0,1-16,0V91.31l-58.34,58.35a8,8,0,0,1-11.32,0L96,123.31l-56,56V200H224A8,8,0,0,1,232,208Z"></path>
		</svg>
	),
	breakingChange: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
			<path d="M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z"></path>
		</svg>
	),
	link: (
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
			<path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
		</svg>
	),
};

export default function ChangelogViewer({
	commits,
	repoName,
	changelogTitle,
	changelogVersionId,
}: {
	commits: Commit[];
	repoName: string;
	changelogTitle: string;
	changelogVersionId: string;
}) {
	const processedCommits = new Set();
	const [entries, setEntries] = useState<ChangelogEntry[]>([]);
	const [changelogTitleUpdated, setChangelogTitleUpdated] = useState(changelogTitle);
	const [isLoading, setIsLoading] = useState(false);
	const generateChangelogRan = useRef(false);

	useEffect(() => {
		if (generateChangelogRan.current) return;
		generateChangelogRan.current = true;

		setEntries([]);
		setIsLoading(true);

		async function getCommitSummaries() {
			const commitPromises = commits
				.filter((commit) => !processedCommits.has(commit.sha))
				.map(async (commit) => {
					try {
						const response = await fetch("/api/generateCommitSummary", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ repoName, commitId: commit.sha }),
						});

						if (!response.ok) throw new Error("Failed to fetch commit summary");
						processedCommits.add(commit.sha);
						return response.text();
					} catch (error) {
						console.error("Error fetching commit summary:", error);
						return null;
					}
				});

			const summaries = (await Promise.all(commitPromises)).filter(Boolean);
			return summaries;
		}

		async function generateChangelog(summaries: string[]) {
			try {
				console.log("Generating changelog...");
				const response = await fetch("/api/generateChangelog", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						commitSummaries: summaries,
						repoName,
						changelogTitle,
					}),
				});

				if (!response.ok) throw new Error("Failed to fetch commit summary");
				const content = await response.text();
				const parsedContent = JSON.parse(content);

				// Map the API response keys to our entry types
				const typeMapping = {
					title: "title",
					whatsNew: "feature",
					bugFixes: "bugfix",
					improvements: "improvement",
					breakingChanges: "breakingChange",
				} as const;


				const newEntries = Object.entries(parsedContent).reduce<ChangelogEntry[]>((acc, [key, content]) => {
					const type = typeMapping[key as keyof typeof typeMapping];
					if (type) {
						if (type === "title") {
							setChangelogTitleUpdated(content as string);
						}
						acc.push({
							id: crypto.randomUUID(),
							type: type, 
							content: content as string,
						});
					}
					return acc;
				}, []);

				setEntries(newEntries);
				await saveChangelogEntry(newEntries, changelogVersionId);
			} catch (error) {
				console.error("Error generating changelog:", error);
			}
		}

		async function saveChangelogEntry(entries: ChangelogEntry[], changelogVersionId: string) {
			await fetch("/api/changelogEntry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ entries, changelogVersionId }),
			});
		}

		async function processChangelog() {
			const summaries = await getCommitSummaries();
			// Filter out any null values before passing to generateChangelog
			const validSummaries = summaries.filter((summary): summary is string => summary !== null);
			await generateChangelog(validSummaries);
			setIsLoading(false);
		}

		processChangelog();
	}, [commits, repoName, changelogVersionId]);

	function addLink(formData: FormData) {
		console.log(formData);
	}

	return (
		<div className="w-full max-w-full">
			{isLoading ? (
				<div className="w-full h-96 relative">
					<div className="absolute inset-1/2 translate-x-10 translate-y-10 w-24 h-24 bg-emerald-300 rounded-full blur-xl opacity-70"></div>
					<div className="absolute inset-1/2 -translate-x-10 translate-y-10 w-24 h-24 bg-emerald-400 rounded-full blur-xl opacity-70"></div>
					<div className="absolute inset-1/2 -translate-x-10 -translate-y-10 w-24 h-24 bg-emerald-500 rounded-full blur-xl opacity-70 animate-pulse"></div>
					<div className="flex items-center justify-center h-full">
						<p className="text-xl font-bold">Generating changelog...</p>
					</div>
				</div>
			) : (
				<>
					<h1 className="text-4xl font-bold mb-4 w-full">{changelogTitleUpdated}</h1>
					<div className="w-full max-w-full prose dark:prose-invert">
						{entries.map((entry) =>
							entry.type === "title" || entry.content === "" ? null : (
								<div key={entry.id} className="w-full max-w-full">
									<h3 className="w-full dark:flex items-center gap-2 hidden">
										{svgIconsDark[entry.type]}
										{readableTypes[entry.type]}
									</h3>
									<h3 className="w-full flex items-center gap-2 dark:hidden">
										{svgIconsLight[entry.type]}
										{readableTypes[entry.type]}
									</h3>
									<p className="w-full">{entry.content}</p>
								</div>
							)
						)}
						<form action={addLink}>
							<div className="flex gap-2">
								<svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1d1d1d" viewBox="0 0 256 256">
									<path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
								</svg>
								<svg className="hidden dark:block" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
									<path d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"></path>
								</svg>
								<input type="text" name="link" placeholder="Link" />
								<button type="submit">Add Link</button>
							</div>
						</form>
					</div>
				</>
			)}
		</div>
	);
}
