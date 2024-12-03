import { saveChangelogEntry, getChangelogEntries } from "@/db/actions/entries";
import { NextResponse } from "next/server";
import { ChangelogEntry } from "@/types/Changelog";

export async function POST(req: Request) {
	try {
		const { entries	, changelogVersionId } = await req.json();
		console.log(entries, changelogVersionId);
		entries.forEach((entry: ChangelogEntry) => saveChangelogEntry(entry.type, entry.content, entry.id));
		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		} else {
			return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
		}
	}
}

export async function GET(req: Request) {
	try {
		const { changelogVersionId } = await req.json();
		const changelogEntries = await getChangelogEntries(changelogVersionId);
		return NextResponse.json(changelogEntries);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		} else {
			return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
		}
	}
}

export async function PUT(req: Request) {
	try {
		const { id, content, type } = await req.json();
		await saveChangelogEntry(type, content, id);
		return NextResponse.json({ success: true });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		} else {
			return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
		}
	}
}
