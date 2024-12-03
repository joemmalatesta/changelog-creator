// This remains a server component
import { Commit } from '@/types/repo';
import ClientCreatePage from './ClientCreatePage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { getRepoInformation } from '@/dataFetch/repository';
type tParams = Promise<{ repoName: string[] }>;

export default async function CreateChangelog({ params }: { params: tParams }) {
	const { repoName } = await params;
	const session = await getServerSession(authOptions);
	let commits: Commit[] = [];

	if (session?.access_token) {
		commits = await getRepoInformation(repoName.join("/"), session.access_token);
	}

	return <ClientCreatePage repoName={repoName.join("/")} commits={commits} />;
}
