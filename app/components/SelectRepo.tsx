"use client";
import { Repository } from "@/types/repo";

export default function SelectRepoButton({ repos, formAction }: { repos: Repository[]; formAction: (formData: FormData) => Promise<void> }) {
	async function handleSubmit(formData: FormData) {
		await formAction(formData);
	}

	return (
		<main>
			<div>
				<input
					className="w-full p-2 rounded-md bg-neutral-200 dark:bg-neutral-700 placeholder:text-dark/50 dark:placeholder:text-light/50"
					type="text"
					placeholder="Filter repositories..."
					onChange={(e) => {
						const filter = e.target.value.toLowerCase();
						const buttons = e.target.parentElement?.querySelectorAll("button");
						buttons?.forEach((button) => {
							const text = button.textContent?.toLowerCase() || "";
							button.style.display = text.includes(filter) ? "" : "none";
						});
					}}
				/>
				<div className="flex flex-col max-h-96 overflow-y-auto items-start">
					{repos.map((repo) => (
						<form key={repo.id} action={handleSubmit} className="w-full hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md ">
							<input type="hidden" name="repo" value={JSON.stringify(repo)} />
							<button type="submit" className="w-full text-start p-2">
								{repo.name}
							</button>
						</form>
					))}
				</div>
			</div>
		</main>
	);
}
