type tParams = Promise<{ changelog: string }>;

export default async function ChangelogPage({ params }: { params: tParams }) {
	const { changelog } = await params;
	// Either published changelog found, or there is no changelog.
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Changelog: {changelog}</h1>
		</div>
	);
}
