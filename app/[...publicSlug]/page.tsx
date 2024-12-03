import { getChangelogByPublicSlug } from "@/db/actions/changelogs";
import { ChangelogEntry } from "@/types/Changelog";

type tParams = Promise<{ publicSlug: string[] }>;

export default async function ChangelogPage({ params }: { params: tParams }) {
	const { publicSlug } = await params;
	const changelogVersions = await getChangelogByPublicSlug(publicSlug.join("/"));
	console.log(changelogVersions);
	// Either published changelog found, or there is no changelog.
	return (
		<div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-8">
			<div className="col-span-3">
				<h2 className="text-2xl font-bold mb-4">Versions</h2>
				{changelogVersions.map((changelogVersion) => (
					<div key={changelogVersion.id} className="py-2"> 
						<h3 className="text-lg font-medium hover:text-emerald-500 cursor-pointer">
							{changelogVersion.title}
						</h3>
					</div>
				))}
			</div>
			<div className="col-span-9">
				<h1 className="text-3xl font-bold mb-6">Changelog: {publicSlug.join("/")}</h1>
				<ChangelogViewer changelogTitle={changelogVersions[0].title} entries={changelogVersions[0].entries} />
			</div>
		</div>
	);
}


function ChangelogViewer({ changelogTitle, entries }: { changelogTitle: string, entries: ChangelogEntry[] }) {
	return (	
		<div>
			<h1 className="text-4xl font-bold mb-4">{changelogTitle}</h1>
			<div className="flex-col pt-3 flex items-start gap-3 w-full">
				{entries.map(entry => (
					entry.type === 'title' ? null : (
						<div key={entry.id} className="prose dark:prose-invert w-full">
							<h2>{entry.type}</h2>
						<p>{entry.content}</p>
					</div>	
					)
				))}
			</div>
		</div>
	);
}
