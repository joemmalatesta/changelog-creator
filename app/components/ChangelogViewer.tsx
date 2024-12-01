"use client";

import { Commit } from "@/types/repo";
import { useChat } from "ai/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChangelogViewer({ commits, repoName, changelogTitle, changelogVersionId }: { commits: Commit[]; repoName: string; changelogTitle: string; changelogVersionId: string }) {
	const { messages, setMessages } = useChat();
	const [finished, setFinished] = useState<boolean>(false);
	const processedCommits = new Set();
	useEffect(() => {
		setMessages([]);
		async function getChangelogEntry(commit: Commit) {
			try {
				// Skip if we've already processed this commit (was running twice)
				if (processedCommits.has(commit.sha)) return;
				processedCommits.add(commit.sha);
				const response = await fetch("/api/generateChangelogEntry", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						repoName,
						commitId: commit.sha,
					}),
				});

				if (!response.ok) throw new Error("Failed to fetch changelog entry");

				const messageId = `${commit.sha}-${Date.now()}`;
				const reader = response.body?.getReader();
				if (!reader) return;

				let content = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					content += new TextDecoder().decode(value);
					setMessages((prev) => {
						const existingIndex = prev.findIndex((m) => m.id === messageId);
						return existingIndex >= 0
							? prev.map((m, i) => (i === existingIndex ? { ...m, content } : m))
							: [...prev, { id: messageId, role: "assistant" as const, content }];
					});
				}
				await saveChangelogEntry(content, changelogVersionId);
			} catch (error) {
				console.error("Error fetching changelog:", error);
			}
		}

		// Process commits sequentially to avoid overwhelming the server
		async function processCommits() {
			await Promise.all(commits.map((commit) => getChangelogEntry(commit)));
			setFinished(true);
			
			// // Create a prettier changelog.
			// const response = await fetch("/api/detailedChangeLog", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "application/json",
			// 	},
			// 	body: JSON.stringify({
			// 		changelogEntries: messages.map((m) => m.content),
			// 		repoName,
			// 	}),
			// });
		}

		async function saveChangelogEntry(content: string, changelogVersionId: string) {
			await fetch("/api/changelogEntry", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ content, changelogVersionId }),
			});
		}

		processCommits();
	}, [commits]);

	return (
		<div>
			<h2 className="text-2xl font-bold">{changelogTitle}</h2>
			<div className=" flex-col pt-3 flex items-start gap-3 w-full border-b dark:border-light/10 border-dark/10 pb-4">
				{messages
					.map((m) => ({
					message: m,
					index: commits.findIndex(c => c.sha === m.id.split("-")[0])
				}))
				.sort((a, b) => a.index - b.index)
				.map(({ message: m }) => (
					<div key={m.id} className="w-full">
						<Link
							href={`https://github.com/${repoName}/commit/${m.id.split("-")[0]}`}
							target="_blank"
							className="text-sm dark:text-light/40 text-dark/60 flex items-center gap-1"
						>
							{commits.find((c) => c.sha === m.id.split("-")[0])?.commit.message}
							<svg className="hidden dark:block opacity-40" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#f2f2f2" viewBox="0 0 256 256">
								<path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path>
							</svg>
							<svg className="dark:hidden opacity-40" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1a1a1a" viewBox="0 0 256 256">
								<path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path>
							</svg>
						</Link>
						<p className="text-base font-medium">• {m.content}</p>
					</div>
				))}
			</div>
			<p className="text-sm text-dark/60 dark:text-light/40">
				commit links will not be shown in public changelogs
			</p>
		</div>
	);
}
