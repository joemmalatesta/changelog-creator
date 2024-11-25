"use client";

import { Commit } from "@/types/repo";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";

export default function ChangelogViewer({ commits, repoName }: { commits: Commit[]; repoName: string }) {
	const { messages, setMessages } = useChat();

	useEffect(() => {
		async function getChangelogEntry(commit: Commit) {
			const response = await fetch("/api/changelogEntry", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					repoName,
					commitId: commit.sha,
				}),
				signal: AbortSignal.timeout(10000),
			});

			if (!response.ok) {
				console.error("Failed to fetch changelog entry");
				return;
			}

			const messageId = `${commit.sha}-${Date.now()}`;
			let fullContent = "";

			const reader = response.body?.getReader();
			if (!reader) return;

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const text = new TextDecoder().decode(value);
					fullContent += text;

					setMessages((prev) => {
						const existingMessageIndex = prev.findIndex((m) => m.id === messageId);
						if (existingMessageIndex >= 0) {
							const newMessages = [...prev];
							newMessages[existingMessageIndex] = {
								...newMessages[existingMessageIndex],
								content: fullContent,
							};
							return newMessages;
						} else {
							return [
								...prev,
								{
									id: messageId,
									role: "assistant" as const,
									content: fullContent,
								},
							];
						}
					});
				}
			} finally {
				reader.releaseLock();
			}
		}

		for (const commit of commits) {
			getChangelogEntry(commit);
		}
	}, []);

	return (
		<div className="w-full flex-col pb-10 pt-3 flex items-start outline">
			{messages.map((m) => (
				<div key={m.id} className="w-full">
					{m.content}
				</div>
			))}
		</div>
	);
}
