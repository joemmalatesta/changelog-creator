import { getChangelogByPublicSlug } from "@/db/actions";

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
