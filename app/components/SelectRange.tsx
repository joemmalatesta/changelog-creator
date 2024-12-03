"use client";

import { Commit } from "@/types/repo";
import { useEffect, useState } from "react";

export default function SelectRange({
	commits,
	formAction,
}: {
	commits: Commit[];
	formAction: (formData: FormData) => Promise<{ commits: Commit[]; title: string; changelogVersionId: string }>;
}) {
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

	// Add this new function to handle commit selection
	const handleCommitClick = (commit: Commit) => {
		if (!rangeStart) {
			setRangeStart(commit);
		} else if (!rangeEnd) {
			// Determine correct order based on commit list
			const clickedIndex = commits.findIndex((c) => c.sha === commit.sha);
			const startIndex = commits.findIndex((c) => c.sha === rangeStart.sha);

			if (clickedIndex < startIndex) {
				setRangeEnd(rangeStart);
				setRangeStart(commit);
			} else {
				setRangeEnd(commit);
			}
		} else {
			// Reset selection and start new range
			setRangeStart(commit);
			setRangeEnd(null);
		}
	};

	return (
		<div>
			{commits.length > 0 ? (
				<div>
					<form className="flex gap-2.5 flex-col" action={handleSubmit}>
						<input className="hidden" required type="text" id="title" name="title" value=" " readOnly />
						<div>
							<p className="text-sm opacity-50 p-0.5">Commits</p>
							<ul className="max-h-96 overflow-y-auto">
								{commits.map((commit) => (
									<li
										key={commit.sha}
										onClick={() => handleCommitClick(commit)}
										className={`w-full flex items-center justify-between p-1 cursor-pointer ${
											commit === rangeStart || commit === rangeEnd
												? "dark:bg-emerald-600/70 bg-emerald-400/70 "
												: rangeStart && rangeEnd && commitsBetween.includes(commit)
												? "dark:bg-neutral-600/40 bg-neutral-300/40 "
												: "hover:bg-neutral-200 dark:hover:bg-neutral-800"
										}`}
									>
										<div className="flex items-center gap-2 w-11/12">
											<p className="whitespace-nowrap overflow-hidden text-ellipsis">{commit.commit.message}</p>
										</div>
										<p className="text-sm opacity-50">{calculateLastUpdated(new Date(commit.commit.author.date))}</p>
									</li>
								))}
							</ul>

							{!rangeStart && !rangeEnd && <p className="opacity-60 p-0.5 text-lg text-center bg-neutral-200 dark:bg-neutral-800 rounded-t-md">Select Starting Commit...</p>}
							{rangeStart && !rangeEnd && <p className="opacity-60 p-0.5 text-lg text-center bg-neutral-200 dark:bg-neutral-800 rounded-t-md">Select Ending Commit...</p>}
							{rangeStart && rangeEnd && (
								<div className="relative rounded flex flex-col justify-between">
									{commitsBetween !== null && <p className="opacity-60 p-0.5 text-lg text-center bg-neutral-200 dark:bg-neutral-800 rounded-t-md">{commitsBetween.length} commits selected</p>}
								</div>
							)}
							{!rangeValid() && <div className="h-10 opacity-0" />}
							{rangeValid() && (
								<>
									<input type="hidden" name="commits" value={JSON.stringify(commitsBetween)} />
									<button type="submit" className="dark:bg-emerald-600/70 bg-emerald-400/70 w-full dark:text-light text-dark px-4 py-2 rounded">
										Generate Changelog
									</button>
								</>
							)}
						</div>
					</form>
				</div>
			) : (
				<p className="opacity-50">No commits</p>
			)}
		</div>
	);
}
