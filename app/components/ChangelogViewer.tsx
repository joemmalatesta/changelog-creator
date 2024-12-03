"use client";

import { ChangelogEntry } from "@/types/Changelog";
import { Commit } from "@/types/repo";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";

const typeToHeader = {
	title: {
		header: "h1",
		className: "text-4xl font-bold mb-4"
	},
	feature: {
		header: "h3", 
		className: "text-2xl font-semibold mt-6 mb-2 text-emerald-600 dark:text-emerald-400"
	},
	bugfix: {
		header: "h3",
		className: "text-2xl font-semibold mt-6 mb-2 text-red-600 dark:text-red-400"
	},
	improvement: {
		header: "h3",
		className: "text-2xl font-semibold mt-6 mb-2 text-blue-600 dark:text-blue-400"
	},
	breakingChange: {
		header: "h3",
		className: "text-2xl font-semibold mt-6 mb-2 text-yellow-600 dark:text-yellow-400"
	},
	link: {
		header: "h3",
		className: "text-2xl font-semibold mt-6 mb-2 text-purple-600 dark:text-purple-400"
	}
} as const;

export default function ChangelogViewer({ 
	commits, 
	repoName, 
	changelogTitle, 
	changelogVersionId, 
}: { 
	commits: Commit[]; 
	repoName: string; 
	changelogTitle: string;
	changelogVersionId: string 
}) {
	const { messages, setMessages } = useChat();
	const [finished, setFinished] = useState<boolean>(false);
	const processedCommits = new Set();
	console.log(finished);

	useEffect(() => {
		setMessages([]);
		
		async function getCommitSummaries() {
			
			for (const commit of commits) {
				if (processedCommits.has(commit.sha)) continue;
				processedCommits.add(commit.sha);
			}

			const commitPromises = commits
				.filter(commit => !processedCommits.has(commit.sha))
				.map(async commit => {
					try {
						const response = await fetch("/api/generateCommitSummary", {
							method: "POST", 
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ repoName, commitId: commit.sha }),
						});

						if (!response.ok) throw new Error("Failed to fetch commit summary");
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
				const response = await fetch("/api/generateChangelog", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ 
						commitSummaries: summaries,
						repoName,
						changelogTitle
					}),
				});

				if (!response.ok) throw new Error("Failed to fetch commit summary");
				const content = await response.text();
				const parsedContent = JSON.parse(content);
				const entries: ChangelogEntry[] = [];
				
				// Map the API response keys to our entry types
				const typeMapping = {
					title: 'title',
					whatsNew: 'feature',
					bugFixes: 'bugfix',
					improvements: 'improvement',
					breakingChanges: 'breakingChange'
				} as const;

				// Loop through each key in the parsed content
				for (const [key, content] of Object.entries(parsedContent)) {
					const type = typeMapping[key as keyof typeof typeMapping];
					if (type) { 
						entries.push({
							id: crypto.randomUUID(),
							type: type,
							content: content as string
						});
					}
				}

				console.log(entries);

				setMessages(entries.map(entry => ({
					id: entry.id,
					role: "assistant" as const,
					content: entry.content
				})));

				await Promise.all(entries.map(entry => saveChangelogEntry([entry], changelogVersionId)));
				setFinished(true);
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
		}

		processChangelog();
	}, [commits, repoName, changelogVersionId]);

	return (
		<div>
			<div className="flex-col pt-3 flex items-start gap-3 w-full border-b dark:border-light/10 border-dark/10 pb-4">
				{messages.map((m) => {
					// Skip messages that don't have a type
					if (!('type' in m)) return null;
					
					const { header, className } = typeToHeader[m.type as keyof typeof typeToHeader];
					const HeaderTag = header as keyof JSX.IntrinsicElements;
					return (
						<div key={m.id} className="w-full">
							<HeaderTag className={className}>{m.content}</HeaderTag>
						</div>
					);
				})}
			</div>
		</div>
	);
}
