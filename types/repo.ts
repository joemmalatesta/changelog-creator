export interface Repository {
	id: number;
	name: string;
	html_url: string;
	full_name: string;
    updated_at: string;
}

export interface PullRequest {
    id: number;
    number: number;
    state: 'open' | 'closed';
    title: string;
    body: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    user: {
        login: string;
        id: number;
        avatar_url: string;
    };
    head: {
        ref: string;
        sha: string;
    };
    base: {
        ref: string;
        sha: string;
    };
    draft: boolean;
    merged: boolean;
    mergeable: boolean | null;
    comments: number;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
}

export interface Commit {
    sha: string;           // The commit ID/hash
    commit: {
        author: {
            date: string;  // The commit date
        };
        message: string;   // The commit message
    };
    stats: {
        additions: number;
        deletions: number;
        total: number;
    };
    files: {
        filename: string;
        additions: number;
        deletions: number;
        changes: number;
        patch?: string;    // The diff patch (optional as it's not always included)
        status: string;    // Status of the file (added, modified, removed, etc.)
    }[];
}