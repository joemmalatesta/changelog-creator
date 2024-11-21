import { Metadata } from "next";
  
interface Props {
	params: {
		changelog: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `Changelog: ${params.changelog}`,
	};
}

export default async function Page({ params }: Props) {
	// Either published changelog found, or there is no changelog.
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Changelog: {params.changelog}</h1>
		</div>
	);
}
