"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Commit, Repository } from "@/types/repo";
import { redirect } from "next/navigation";
import SelectRepoButton from "./components/SelectRepo";
import { fetchUserRepos } from "../dataFetch/repository";

export default async function Home() {
	const session = await getServerSession(authOptions);
	let repos: Repository[] = [];

	// on pageload
	if (session?.access_token) {
		repos = await fetchUserRepos(session.access_token);
	}

	async function selectRepo(formData: FormData) {
		"use server";
		const repoData = JSON.parse(formData.get("repo") as string) as Repository;
		redirect(`/create/${repoData.full_name}`);
	}

	// Pass both repos and the form action to the client component
	return (
		<main>
			<h1 className="text-2xl font-bold mb-2">Create new changelog</h1>
			{!session ? <p>Please log in to create a changelog.</p> : <SelectRepoButton repos={repos} formAction={selectRepo} />}
		</main>
	);
}
