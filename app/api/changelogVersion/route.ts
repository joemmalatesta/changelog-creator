import { createChangelogVersion, editChangelogVersion } from "@/db/actions/versions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { title, repoName, startDate, endDate } = await req.json();
		console.log(startDate, endDate);
		const changelogVersionId = await createChangelogVersion(title, repoName, startDate, endDate);
		return NextResponse.json({ changelogVersionId });
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		} else {
			return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
		}
	}
}

// export async function GET(req: Request) {
// 	try {
// 		const { changelogVersionId } = await req.json();
// 		const changelogEntries = await getChangelogEntries(changelogVersionId);
// 		return NextResponse.json(changelogEntries);
// 	} catch (error: any) {
// 		return NextResponse.json({ error: error.message }, { status: 500 });
// 	}
// }

export async function PUT(req: Request) {
	try {
		const { id, versionTitle } = await req.json();
		await editChangelogVersion(id, versionTitle);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
