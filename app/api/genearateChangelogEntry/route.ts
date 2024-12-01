import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";
import { Commit } from "@/types/repo";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { repoName, commitId } = await req.json();
	const diffs = await getDiffsFromCommit(repoName, commitId);

	const result = streamText({
		model: openai("gpt-4o-mini"),
		prompt: await createPrompt(diffs.commitMessage, diffs.files),
		temperature: 0.7, // Adds some creativity while keeping it professional
		maxTokens: 100, // Ensures we get a concise response
	});

	return result.toTextStreamResponse();
}

async function getDiffsFromCommit(repoName: string, commitId: string) {
	const session = await getServerSession(authOptions);
	if (!session?.access_token) {
		throw new Error("Authentication required");
	}

	const response = await fetch(`https://api.github.com/repos/${repoName}/commits/${commitId}`, {
		headers: {
			Authorization: `Bearer ${session.access_token}`,
			Accept: "application/vnd.github.v3+json",
			"X-GitHub-Api-Version": "2022-11-28",
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}

	const commit: Commit = await response.json();

	const files = await Promise.all(
		commit.files.map(async (file: any) => ({
			filename: file.filename,
			status: file.status,
			additions: file.additions,
			deletions: file.deletions,
			patch: file.patch,
		}))
	);

	return {
		commitMessage: commit.commit.message,
		files,
	};
}

async function createPrompt(commitMessage: string, diffs: any[]) {
	const diffsSummary = diffs
		.map(
			(diff) => `
File: ${diff.filename}
Status: ${diff.status}
Changes: +${diff.additions}, -${diff.deletions}
Patch:
${diff.patch || "No patch available"}
`
		)
		.join("\n");

	return `Generate a single, concise changelog entry (1-2 sentences) based on the following commit changes.
Focus on the business impact or user-facing changes rather than technical details.
Original commit message: "${commitMessage}"


Changes made:
${diffsSummary}

Changelog entry:`;
}
