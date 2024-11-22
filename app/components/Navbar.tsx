"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ThemeManager } from "./ThemeManager";

export default function Navbar() {
	const { data: session } = useSession();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<div className="flex justify-between items-center py-4">
			<a href="/">
				<h3 className="text-xl font-bold">Changelog</h3>
			</a>
			{!session && (
				<div className="flex justify-end gap-4 items-center">
					<button onClick={() => signIn("github")}>Sign in with GitHub</button>
					<ThemeManager />
				</div>
			)}
			{session && (
				<div className="flex justify-end items-center gap-3 ">
				<div className="relative">
					<button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
						<img src={session.user?.image || ""} alt="user image" className="w-9 h-9 rounded-full hover:opacity-80 transition-opacity" />
					</button>
					{dropdownOpen && (
						<div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
							<button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
								Sign out
							</button>
						</div>
					)}
				</div>
					<ThemeManager />
				</div>
			)}
		</div>
	);
}
