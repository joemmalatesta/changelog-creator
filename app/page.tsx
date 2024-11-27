"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { Repository } from "@/types/repo";
import { redirect } from "next/navigation";
import SelectRepoButton from "./components/SelectRepo";
import { fetchUserRepos } from "../dataFetch/repository";
import { Suspense } from "react";
import ReposLoading from "./components/ReposLoading";
import { db } from "@/db";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main>
			<h1 className="text-2xl font-bold mb-2">Create new changelog</h1>
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
async function RepoLoader({ session }: { session: any }) {
	const repos = session?.access_token ? await fetchUserRepos(session.access_token) : [];
	
	return <SelectRepoButton repos={repos} formAction={selectRepo} />;
}

async function selectRepo(formData: FormData) {
	"use server";
	const repoData = JSON.parse(formData.get("repo") as string) as Repository;
	redirect(`/create/${repoData.full_name}`);
}
