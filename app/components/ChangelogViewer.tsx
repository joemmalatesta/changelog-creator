"use client";

import { ChangelogEntry } from "@/types/Changelog";
import { Commit } from "@/types/repo";
import { useEffect, useState, useRef } from "react";
import {Link, LinkBreak, ChartLineUp, Bug, ArrowsDownUp } from "@phosphor-icons/react"

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
	feature: <ArrowsDownUp color="#f2f2f2" size={32} />,
	bugfix: <Bug color="#f2f2f2" size={32} />,
	improvement: <ChartLineUp color="#f2f2f2" size={32} />,
	breakingChange: <LinkBreak color="#f2f2f2" size={32} />,
	link: <Link color="#f2f2f2" size={32} />
};
const svgIconsLight = {
	title: <></>,
	feature: <ArrowsDownUp color="#1a1a1a" size={32} />,
	bugfix: <Bug color="#1a1a1a" size={32} />,
	improvement: <ChartLineUp color="#1a1a1a" size={32} />,
	breakingChange: <LinkBreak color="#1a1a1a" size={32} />,
	link: <Link color="#1a1a1a" size={32} />
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
								<div className="hidden dark:block">
									{svgIconsDark.link}
								</div>
								<div className="block dark:hidden">
									{svgIconsLight.link}
								</div>
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
