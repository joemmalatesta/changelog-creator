import { ChangelogData } from "@/types/Changelog";

export default function ChangelogViewer() {
    const exampleData: ChangelogData[] = [
        {
            id: "1",
            content: "- This is a **test** __changelog__",
            link: "https://example.com/changelog",
        },
    ];
	return (
        <div>
            <h1 className="text-2xl font-bold">Changelog</h1>
            <article className="prose dark:prose-invert">
            {exampleData.map((changelog) => (
                <a key={changelog.id} className="no-underline text-xl" href={changelog.link}>{changelog.content}</a>                
            ))}
            </article>
        </div>
    );
}
