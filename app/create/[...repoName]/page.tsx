// This remains a server component
import { Commit } from '@/types/repo';
import ClientCreatePage from './ClientCreatePage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getRepoInformation } from '@/dataFetch/repository';

export default async function CreatePage({ params }: { params: { repoName: string[] } }) {
    const { repoName } = await params;
    const session = await getServerSession(authOptions);
    let commits: Commit[] = [];
    
    if (session?.access_token) {
        commits = await getRepoInformation(repoName.join("/"), session.access_token);
    }

	return <ClientCreatePage repoName={repoName.join("/")} commits={commits} />;
}
