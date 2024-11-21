import Navbar from "@/app/components/Navbar";
import RepositorySelector from "./components/RepoSelector/server";
export default async function Home() {
	return (
		<main>
			<RepositorySelector />
			{/* Repos and stuff on the right */}
			{/* Changelog on the left. */}
		</main>
	);
}
