import { db } from "@/db";
import { Commit, Repository } from "@/types/repo";
import { createChangelogEntry, editChangelogEntry, getChangelogEntries } from "@/db/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { changelogEntry, changelogVersionId } = await req.json();
		await createChangelogEntry(changelogEntry, changelogVersionId);
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
		await editChangelogEntry(id, changelogEntry);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
