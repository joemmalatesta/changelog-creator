"use client";

import { Commit } from "@/types/repo";
import { resetRepo, createChangelog } from "../actions";
import SelectRange from "@/app/components/SelectRange";
import ChangelogViewer from "@/app/components/ChangelogViewer";
import { useState } from "react";

interface ClientCreatePageProps {
	repoName: string;
	commits: Commit[];
}

export default function ClientCreatePage({ repoName, commits }: ClientCreatePageProps) {
	const [commitRange, setCommitRange] = useState<Commit[]>([]);
	const [changelogTitle, setChangelogTitle] = useState<string>("");

	const handleCreateChangelog = async (formData: FormData) => {
		const result = await createChangelog(formData);
		setCommitRange(result.commits);
		console.log(result.title);
		setChangelogTitle(result.title);
		return result;
	};

	return (
		<div className="flex gap-10">
			<div className="flex flex-col gap-2 w-2/5">
				<form action={resetRepo} className="flex gap-1 items-center mb-2">
					<button type="submit">
						<svg className="dark:hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#1a1a1a" viewBox="0 0 256 256">
							<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
						</svg>
						<svg className="dark:block hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#f2f2f2" viewBox="0 0 256 256">
							<path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
						</svg>
					</button>
					<h2 className="text-2xl font-bold">{repoName}</h2>
				</form>
				<SelectRange commits={commits} formAction={handleCreateChangelog} />
			</div>
			<div className="w-3/5">
				{commitRange.length > 0 && changelogTitle ? (
					<ChangelogViewer commits={commitRange} repoName={repoName} changelogTitle={changelogTitle} />
				) : (
					<div className="flex flex-col items-center justify-center h-full gap-8">
						<div className="relative">
							<div className="absolute -inset-1 rounded-lg dark:bg-emerald-400/10 bg-emerald-400/30 blur-xl animate-pulse"></div>
							<div className="relative rounded-lg p-8">
								<p className="text-center text-2xl font-bold opacity-70">
									Select {repoName.split("/")[1]} commit range...
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}