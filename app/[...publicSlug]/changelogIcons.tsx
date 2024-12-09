"use client";

import { ArrowsDownUp, Bug, ChartLineUp, LinkBreak, Link } from "@phosphor-icons/react";

export function ChangelogIcons({ type, isDark }: { type: string; isDark: boolean }) {
	const color = isDark ? "#f2f2f2" : "#1a1a1a";

	switch (type) {
		case "feature":
			return <ArrowsDownUp color={color} size={32} />;
		case "bugfix":
			return <Bug color={color} size={32} />;
		case "improvement":
			return <ChartLineUp color={color} size={32} />;
		case "breakingChange":
			return <LinkBreak color={color} size={32} />;
		case "link":
			return <Link color={color} size={32} />;
		default:
			return null;
	}
}
