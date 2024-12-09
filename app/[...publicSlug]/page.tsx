import { getChangelogByPublicSlug } from "@/db/actions/changelogs";
import { getChangelogEntries } from "@/db/actions/entries";
import { ChangelogEntry } from "@/types/Changelog";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChangelogIcons } from "@/app/[...publicSlug]/changelogIcons";
import Link from "next/link";

type Params = Promise<{ publicSlug: string[] }>;
type SearchParams = Promise<{ version?: string }>;

async function selectChangelog(formData: FormData) {
	"use server";
	const selected = formData.get("changelogId");
	revalidatePath(`/${formData.get("path")}`);
	redirect(`/${formData.get("path")}?version=${selected}`);
}

export default async function ChangelogPage({
	params,
	searchParams,
}: {
	params: Params;
	searchParams: SearchParams;
}) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const { publicSlug } = resolvedParams;
	const { version } = resolvedSearchParams;

	const changelogVersions = (await getChangelogByPublicSlug(publicSlug.join("/"))).sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	);

	// Find selected version if version parameter exists, otherwise use first version
	const selectedVersion = version
		? changelogVersions.find((v) => v.id === version)
		: changelogVersions[0] || null;

	return (
		<div className="mx-auto px-4 py-8">
			<div className="flex gap-8 w-full">
				<div className="w-1/3">
					<h2 className="text-xl font-bold mb-6">{publicSlug.join("/")}</h2>
					{changelogVersions.map((changelogVersion) => (
						<form key={changelogVersion.id} action={selectChangelog}>
							<input type="hidden" name="changelogId" value={changelogVersion.id} />
							<input type="hidden" name="path" value={publicSlug.join("/")} />
							<button
								type="submit"
								className={`text-left w-full p-2 rounded ${
									selectedVersion?.id === changelogVersion.id ? "bg-emerald-300/60 dark:bg-emerald-800/60" : "hover:bg-emerald-200/60 dark:hover:bg-emerald-900/60"
								}`}
							>
								<h2 className="font-bold">{changelogVersion.title} <span className="font-normal text-xs opacity-70">{changelogVersion.createdAt.toLocaleDateString()}</span></h2>
							</button>
						</form>
					))}
				</div>
				<div className="w-2/3 flex">
					{selectedVersion ? (
						<ChangelogViewer
							changelogTitle={selectedVersion.title}
							changelogVersionId={selectedVersion.id}
							versionDate={selectedVersion.createdAt.toLocaleDateString()}
						/>
					) : (
						<div className="h-full flex items-center justify-center text-gray-500">Select a version to view the changelog</div>
					)}
				</div>
			</div>
		</div>
	);
}

async function ChangelogViewer({
	changelogTitle,
	changelogVersionId,
	versionDate,
}: {
	changelogTitle: string;
	changelogVersionId: string;
	versionDate: string;
}) {
	const entries: ChangelogEntry[] = (await getChangelogEntries(changelogVersionId)) as ChangelogEntry[];
	const sortedEntries = entries.sort((a, b) => {
		const typeOrder = {
			feature: 1,
			improvement: 2, 
			bugfix: 3,
			breakingChange: 4,
			link: 5,
			title: 6
		};
		return typeOrder[a.type] - typeOrder[b.type];
	});

	const readableTypes = {
		title: "Title",
		feature: "What's New",
		bugfix: "Bug Fixes",
		improvement: "Improvements",
		breakingChange: "Breaking Changes",
		link: "Links",
	} as const;

	return (
		<div className="flex flex-col gap-4">
			<p className="text-sm opacity-70 m-0 p-0">{versionDate}</p>
			<div className="prose dark:prose-invert w-full 2xl:prose-lg">
				<h2 className="dark:p-0 dark:m-0 font-bold">{changelogTitle}</h2>
				<div className="flex-col flex items-start gap-3 dark:gap-1 w-full">
					{sortedEntries.map((entry) =>
						entry.type === "title" || entry.content === "" ? null : 
							entry.type === "link" ? (
								<div key={entry.id} className="w-full flex items-center gap-2">
									<div className="dark:hidden">
										<ChangelogIcons type={entry.type} isDark={false} />
									</div>
									<div className="hidden dark:block">
										<ChangelogIcons type={entry.type} isDark={true} />
									</div>
									<Link href={entry.content} target="_blank" rel="noopener noreferrer" className="hover:underline">{entry.content}</Link>
								</div>
							) : (
								<div key={entry.id} className="w-full max-w-full">
									<h3 className="w-full dark:flex items-center gap-2 hidden">
										<ChangelogIcons type={entry.type} isDark={true} />
										{readableTypes[entry.type]}
									</h3>
									<h3 className="w-full flex items-center gap-2 dark:hidden">
										<ChangelogIcons type={entry.type} isDark={false} />
										{readableTypes[entry.type]}
									</h3>
									<p className="w-full">{entry.content}</p>
								</div>
							)
					)}
				</div>
			</div>
		</div>
	);
}
