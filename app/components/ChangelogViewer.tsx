"use client";

import { Commit } from "@/types/repo";
import { Message, useChat } from "ai/react";
import { useEffect, useState } from "react";

export default function ChangelogViewer({ commits }: { commits: Commit[] }) {
	const { messages, setMessages } = useChat();

	useEffect(() => {
		async function getChangelogEntry(commit: Commit) {
			const response = await fetch("/api/changelogEntry", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: `Analyze this commit: ${commit.sha}`,
				}),
				signal: AbortSignal.timeout(10000),
			});
			
			if (!response.ok) {
				console.error('Failed to fetch changelog entry');
				return;
			}

			const reader = response.body?.getReader();
			if (!reader) return;

			try {
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					
					const text = new TextDecoder().decode(value);
					const newMessage = { 
						id: `${commit.sha}-${Date.now()}`, 
						role: 'assistant' as const, 
						content: text 
					};
					setMessages((prev) => [...prev, newMessage]);
				}
			} finally {
				reader.releaseLock();
			}
		}

		for (const commit of commits) {
			getChangelogEntry(commit);
		}
	}, [commits, setMessages]);

	return (
		<div className="flex flex-col w-full max-w-md pb-10 pt-3 mx-auto stretch">
			{messages.map((m) => (
				<div key={m.id} className="whitespace-pre-wrap">
					{m.content}
				</div>
			))}
		</div>
	);
}
