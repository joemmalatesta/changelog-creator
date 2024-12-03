"use server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { Repository } from "@/types/repo";
import { redirect } from "next/navigation";
import SelectRepoButton from "./components/SelectRepo";
import { fetchUserRepos } from "../dataFetch/repository";
import { Suspense } from "react";
import ReposLoading from "./components/ReposLoading";
import { createOrGetChangelog } from "@/db/actions/changelogs";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main>
			<h1 className="text-3xl font-bold mb-5">Select a repository to get started</h1>
			{!session ? (
				<p>Please log in to create a changelog.</p>
			) : (
				<Suspense fallback={<ReposLoading />}>
					<RepoLoader session={session} />
				</Suspense>
			)}
		</main>
	);
}

// Separate component to handle the async repos loading
async function RepoLoader({ session }: { session: Session }) {
	const repos = session?.access_token ? await fetchUserRepos(session.access_token) : [];
	
	return <SelectRepoButton repos={repos} formAction={selectRepo} />;
}

async function selectRepo(formData: FormData) {
	"use server";
	const session = await getServerSession(authOptions);
	if (!session || !session.user) return;
	const repoData = JSON.parse(formData.get("repo") as string) as Repository;
	createOrGetChangelog(session.user.email!, repoData.full_name, repoData.full_name);
	redirect(`/create/${repoData.full_name}`);
}
