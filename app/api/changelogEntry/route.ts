import { saveChangelogEntry, getChangelogEntries } from "@/db/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { content, changelogVersionId } = await req.json();
		console.log(content, changelogVersionId);
		await saveChangelogEntry(content, changelogVersionId);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const { changelogVersionId } = await req.json();
		const changelogEntries = await getChangelogEntries(changelogVersionId);
		return NextResponse.json(changelogEntries);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const { id, changelogEntry } = await req.json();
		await saveChangelogEntry(id, changelogEntry);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
