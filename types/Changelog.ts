export interface ChangelogEntry {
    id: string;
    type: "title" | "feature" | "bugfix" | "improvement" | "breakingChange" | "link";
    content: string;
}
