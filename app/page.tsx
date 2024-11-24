import Navbar from "@/app/components/Navbar";
import RepoSelector from "./components/GenerateChangelog";
import ChangelogViewer from "./components/ChangelogViewer";
export default async function Home() {
	return (
		<main>
			<div className="flex justify-between gap-10">
				<div className="w-1/3">
					<RepoSelector />
				</div>
				<div className="w-2/3">
					<ChangelogViewer />
				</div>
			</div>
		</main>
	);
}
