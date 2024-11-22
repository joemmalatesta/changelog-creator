"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Commit, PullRequest, Repository } from "@/types/repo";
import SelectRepoButton from "./SelectRepoButton";



export default async function RepositorySelector() {
    const session = await getServerSession(authOptions);
    let repos: Repository[] = [];
    
    // on pageload
    if (session?.access_token) {
        repos = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc", {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }).then(res => res.json());
    }


    async function getRepoInformation(repo: Repository) {   
        "use server";
        const session = await getServerSession(authOptions);
        if (!session?.access_token) return { pullRequests: [], commits: [] };

        const pullRequests: PullRequest[] = await fetch(`https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=100`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }).then(res => res.json());
        const commits: Commit[] = await fetch(`https://api.github.com/repos/${repo.full_name}/commits?per_page=100`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        }).then(res => res.json());
        return {pullRequests, commits};
    }

    async function handleFormSubmit(formData: FormData) {
        "use server";
        const repoData = JSON.parse(formData.get('repo') as string) as Repository;
        return getRepoInformation(repoData);
    }


    // Pass both repos and the form action to the client component
    return (
		<SelectRepoButton repos={repos} formAction={handleFormSubmit} />
	);
}
