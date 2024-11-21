import { getServerSession } from "next-auth";

// Server actions/functions
export async function fetchUserRepos() {
    'use server';
    console.log('running on server');
    const session = await getServerSession();
    if (!session?.access_token) {
        throw new Error('No access token available');
    }
	const response = await fetch("https://api.github.com/user/repos", {
		headers: {
			Authorization: `Bearer ${session.access_token}`,
		},
		cache: 'no-store',
	});
	
	if (!response.ok) {
		throw new Error('Failed to fetch repositories');
	}
	
	return response.json();
}

export async function starRepository(repoFullName: string) {
    'use server';
    const session = await getServerSession();
    if (!session?.access_token) {
        throw new Error('No access token available');
    }
	const response = await fetch(`https://api.github.com/user/starred/${repoFullName}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${session.access_token}`,
		},
	});
	
	if (!response.ok) {
		throw new Error('Failed to star repository');
	}
	
	return true;
}