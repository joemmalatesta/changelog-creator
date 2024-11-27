import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/utils/authOptions";
import { Commit } from "@/types/repo";
import { z } from "zod";

export async function POST(req: Request) {
	const { changelogEntries, repoName } = await req.json();

	const result = streamText({
		model: openai("gpt-4o-mini"),
        prompt: await createDetailedPrompt(changelogEntries, repoName),
		temperature: 0.7, // Adds some creativity while keeping it professional
		maxTokens: 100, // Ensures we get a concise response
	});

	return result.toTextStreamResponse();
}


async function createDetailedPrompt(changelogEntries: string[], repoName: string) {
    const prompt = `You are a professional technical writer creating detailed changelog entries. Your task is to write a comprehensive changelog for the software project ${repoName.split("/")[1]}.

    For each change, provide the following sections:
    1. Title (as a level 2 heading)
    2. What's New (a clear description of the new feature or change)
    3. Impact (how this affects users and what actions they need to take)
    4. Technical Details (including API changes, new parameters, or modified behaviors)
    5. Upgrade Instructions (if applicable)

    Format your response in markdown with clear section hierarchies.

    Example format:
    ## [Feature Name]
    ### What's New
    [Clear description of the new feature or change]

    ### Impact
    [Description of how this affects users]

    ### Technical Details
    - API Changes:
      - New endpoints/parameters
      - Modified behaviors
    - Implementation details

    ### Upgrade Instructions
    [Step-by-step upgrade process if applicable]

    Please analyze and restructure the following changes:
    ${changelogEntries.join("\n\n")}`;
    
    return prompt;
}


interface Changelog {
    whatsNew: string;
    bugFixes: string;
    breakingChanges: string;
    improvements: string;
}