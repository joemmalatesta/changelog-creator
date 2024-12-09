"use client";

import { ChangelogEntry } from "@/types/Changelog";
import { Commit } from "@/types/repo";
import { useEffect, useState, useRef } from "react";
import {Link as LinkIcon, LinkBreak, ChartLineUp, Bug, ArrowsDownUp } from "@phosphor-icons/react"
import Link from "next/link";

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
	link: <LinkIcon color="#f2f2f2" size={32} />
};
const svgIconsLight = {
	title: <></>,
	feature: <ArrowsDownUp color="#1a1a1a" size={32} />,
	bugfix: <Bug color="#1a1a1a" size={32} />,
	improvement: <ChartLineUp color="#1a1a1a" size={32} />,
	breakingChange: <LinkBreak color="#1a1a1a" size={32} />,
	link: <LinkIcon color="#1a1a1a" size={32} />
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

				// Update version title in database
				await fetch("/api/changelogVersion", {
					method: "PUT", 
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id: changelogVersionId,
						versionTitle: parsedContent.title
					})
				});

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


	const [links, setLinks] = useState<string[]>([]);
	async function addLink(formData: FormData) {
		const link = formData.get("link");
		setLinks([...links, link as string]);
		await fetch("/api/changelogEntry", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: changelogVersionId,
				content: link,
				type: "link",
			}),
		});
	}

	return (
		<div className="w-full max-w-full">
			{isLoading ? (
				<div className="w-full h-96 flex flex-col items-center justify-center gap-4">
					<div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
					<div className="flex flex-col items-center gap-2">
						<p className="text-xl font-bold">Generating changelog</p>
						<p className="text-sm text-gray-500">This may take a few moments</p>
					</div>
				</div>
			) : (
				<>
					<div className="w-full max-w-full prose dark:prose-invert">
					<h2 className="font-bold mb-4 w-full">{changelogTitleUpdated}</h2>
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
						{links.map((link, index) => (
							<div key={index} className="w-full max-w-full flex items-center gap-2">
								<LinkIcon size={32} />
								<Link href={link} target="_blank" className="hover:underline">{link}</Link>
							</div>
						))}
						<form action={addLink}>
							<div className="flex gap-1 items-center">
								<div className="hidden dark:block">
									{svgIconsDark.link}
								</div>
								<div className="block dark:hidden">
									{svgIconsLight.link}
								</div>
								<input type="text" name="link" placeholder="Link" className="w-96 p-1 rounded-md dark:bg-neutral-700 dark:text-white dark:border-neutral-700 bg-dark/10" />
								<button type="submit" className="dark:bg-emerald-300/50 bg-emerald-600/70 hover:bg-emerald-600/80 dark:hover:bg-emerald-300/70 px-3 text-white p-1 rounded-md">Add Link</button>
							</div>
						</form>
					</div>
				</>
			)}
		</div>
	);
}
