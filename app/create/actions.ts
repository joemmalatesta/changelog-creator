import { Commit } from "@/types/repo";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createChangelog(formData: FormData) {
    const commits = JSON.parse(formData.get("commits") as string) as Commit[];
    const title = formData.get("title") as string;
    return { commits, title };
}

export async function resetRepo() {
    redirect("/");
}