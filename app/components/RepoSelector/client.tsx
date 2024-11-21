"use client";

import { useState } from "react";

interface Repository {
	id: number;
	name: string;
	html_url: string;
}

interface Props {
	initialRepos: Repository[];
	onRepositorySelect?: (repo: Repository) => void;
}

export default function RepositorySelectorClient({ initialRepos, onRepositorySelect }: Props) {
	const [repos] = useState<Repository[]>(initialRepos);
	const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

	return (
		<div className="mt-4">
			<h2>Your Repositories:</h2>
			<div className="relative">
				<input
					type="text"
					placeholder="Search repositories..."
					className="w-full p-2 border rounded mb-2"
					onChange={(e) => {
						const searchTerm = e.target.value.toLowerCase();
						const filteredRepos = repos.filter((repo) => repo.name.toLowerCase().includes(searchTerm));
						setFilteredRepos(filteredRepos);
					}}
				/>
				<div className="max-h-60 overflow-y-auto border dark:border-neutral-800 border-neutral-300 rounded flex items-start flex-col">
					{(filteredRepos.length > 0 ? filteredRepos : repos).map((repo) => (
						<button className="p-2 dark:hover:bg-neutral-800 hover:bg-gray-200 rounded-md w-full text-start " onClick={() => {
							// set the repo 
							setSelectedRepo(repo);
							onRepositorySelect?.(repo);
						}} key={repo.id}>{repo.name}</button>
					))}
				</div>
                <p className="text-sm text-neutral-500">Selected Repository: {selectedRepo?.name}</p>
                
			</div>
		</div>
	);
}
