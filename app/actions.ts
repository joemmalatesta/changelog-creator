import { revalidatePath } from "next/cache";
import { getRepoInformation } from "../dataFetch/repository";
import { Repository } from "@/types/repo";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

// async function selectRepo(formData: FormData) {
//     "use server";
//     const repoData = JSON.parse(formData.get("repo") as string) as Repository;
//     const session = await getServerSession(authOptions);
//     if (!session?.access_token) return;
//     const commits = await getRepoInformation(repoData.id.toString(), session.access_token);
//     revalidatePath("/");
//     redirect(`/create/${repoData.id}`);
// }
