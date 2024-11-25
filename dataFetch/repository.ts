import { Repository } from "@/types/repo";
import { Commit } from "@/types/repo";

// Get all repos for a user
export async function fetchUserRepos(accessToken: string) {
	"use server";
	const response = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc&role=owner", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch repositories");
	}

	return response.json();
}

// Get repo data for a single repo
export async function getRepoData(repoId: string, accessToken: string) {
	"use server";
	console.log(repoId, accessToken);
	const repo: Repository = await fetch(`https://api.github.com/repos/${repoId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}).then((res) => res.json());
	console.log(repo);
	return repo;
}

// Get all commits for a repo
export async function getRepoInformation(repoName: string, accessToken: string) {
	"use server";
	const commits: Commit[] = await fetch(`https://api.github.com/repos/${repoName}/commits?per_page=100`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	}).then((res) => res.json());
	return commits;
}
