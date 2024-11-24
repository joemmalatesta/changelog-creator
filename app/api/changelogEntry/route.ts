import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { content } = await req.json();
	console.log(content);

	const result = streamText({
		model: openai("gpt-4o-mini"),
		prompt: content,
	});


	return result.toDataStreamResponse();
}
