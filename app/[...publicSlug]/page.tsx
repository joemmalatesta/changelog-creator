import { getChangelogByPublicSlug } from "@/db/actions/changelogs";

type tParams = Promise<{ publicSlug: string[] }>;

export default async function ChangelogPage({ params }: { params: tParams }) {
	const { publicSlug } = await params;
	const changelogVersions = await getChangelogByPublicSlug(publicSlug.join("/"));
	console.log(changelogVersions);
	// Either published changelog found, or there is no changelog.
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Changelog: {publicSlug.join("/")}</h1>
			{changelogVersions.map((changelogVersion) => (
				<div key={changelogVersion.id}> 
					<h2 className="text-2xl font-bold">{changelogVersion.title}</h2>
				</div>
			))}
		</div>
	);
}


// function ChangelogViewer({ changelogTitle, entries }: { changelogTitle: string, entries: ChangelogEntry[] }) {
// 	return (	
// 		<div>
// 			<h1 className="text-4xl font-bold mb-4">{changelogTitle}</h1>
// 			<div className="flex-col pt-3 flex items-start gap-3 w-full">
// 				{entries.map(entry => (
// 					entry.type === 'title' ? null : (
// 						<div key={entry.id} className="prose dark:prose-invert w-full">
// 							<h2>{entry.type}</h2>
// 						<p>{entry.content}</p>
// 					</div>	
// 					)
// 				))}
// 			</div>
// 		</div>
// 	);
// }
