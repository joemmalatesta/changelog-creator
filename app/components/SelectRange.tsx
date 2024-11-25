"use client";

import { Commit } from "@/types/repo";
import { useEffect, useState } from "react";

export default function SelectRange({ commits, formAction }: { commits: Commit[]; formAction: (formData: FormData) => Promise<{ commits: Commit[]; title: string }> }) {
	const [rangeStart, setRangeStart] = useState<Commit | null>(null);
	const [rangeEnd, setRangeEnd] = useState<Commit | null>(null);
	const [commitsBetween, setCommitsBetween] = useState<Commit[]>([]);

	async function handleSubmit(formData: FormData) {
		await formAction(formData);
	}

	const calculateLastUpdated = (lastUpdated: Date) => {
		const today = new Date();
		const diffTime = today.getTime() - lastUpdated.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffMonths = Math.floor(diffDays / 30);

		if (diffDays === 0) {
			return "today";
		} else if (diffDays < 30) {
			return `${diffDays}d`;
		} else {
			return `${diffMonths}mo`;
		}
	};

	// Calculate the number of commits between the start and end range
	useEffect(() => {
		if (rangeStart && rangeEnd) {
			const startIndex = commits.findIndex((commit) => commit.sha === rangeStart.sha);
			const endIndex = commits.findIndex((commit) => commit.sha === rangeEnd.sha);

			if (startIndex !== -1 && endIndex !== -1) {
				setCommitsBetween(commits.slice(startIndex, endIndex + 1));
			}
		} else {
			setCommitsBetween([]);
		}
	}, [rangeStart, rangeEnd, commits]);

	function rangeValid() {
		if (!rangeStart || !rangeEnd) return false;
		if (commitsBetween.length < 1) return false;
		return true;
	}

	return (
		<div>
			{commits.length > 0 ? (
				<div>
					<ul className="max-h-96 overflow-y-auto">
						{commits.map((commit) => (
							<li key={commit.sha} className="w-full flex items-center justify-between p-1">
								<div className="flex items-center gap-2">
									<div className="flex gap-2">
										<button
											onClick={() => setRangeStart(commit)}
											className={`px-2 py-1 rounded ${rangeStart === commit ? "bg-blue-500 text-white" : "bg-neutral-200 dark:bg-neutral-700"}`}
										>
											Start
										</button>
										<button
											onClick={() => setRangeEnd(commit)}
											className={`px-2 py-1 rounded ${rangeEnd === commit ? "bg-blue-500 text-white" : "bg-neutral-200 dark:bg-neutral-700"}`}
										>
											End
										</button>
									</div>
									<p className="w-11/12 whitespace-nowrap overflow-hidden text-ellipsis">{commit.commit.message}</p>
								</div>
								<p className="text-sm opacity-50">{calculateLastUpdated(new Date(commit.commit.author.date))}</p>
							</li>
						))}
					</ul>
				</div>
			) : (
				<p className="opacity-50">No commits</p>
			)}

			{(rangeStart || rangeEnd) && (
				<div className="relative mt-4 p-2 rounded h-32 flex flex-col justify-between">
					<div className="absolute left-0 top-2 bottom-0 w-[2px] h-28 bg-neutral-300 dark:bg-neutral-600" />
					{rangeStart && <p>{rangeStart.commit.message}</p>}
					{commitsBetween !== null && <p className="text-sm text-neutral-500">{commitsBetween.length} commits selected</p>}
					{rangeEnd && <p>{rangeEnd.commit.message}</p>}
					{!rangeValid() && <p className="text-red-500 text-sm">Select a valid range</p>}
				</div>
			)}
			{rangeValid() && (
				<form action={handleSubmit}>
					<div className="flex flex-col items-start">
						<label htmlFor="title">Title</label>
						<input required type="text" id="title" name="title" />
					</div>
					<input type="hidden" name="commits" value={JSON.stringify(commitsBetween)} />
					<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
						Submit
					</button>
				</form>
			)}
		</div>
	);
}
