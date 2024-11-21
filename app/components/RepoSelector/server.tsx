"use server";

import { useState } from "react";
import { getServerSession } from "next-auth";
import RepositorySelectorClient from "./client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  user: {
    login: string;
  };
}

export default async function RepositorySelector() {
  const session = await getServerSession(authOptions);
  let repos = [];

  if (session?.access_token) {
    repos = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }).then(res => res.json());
  }

  async function fetchPullRequests(owner: string, repo: string) {
    if (!session?.access_token) return [];
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    return response.json();
  }

  return (
    <div>
      <RepositorySelectorClient 
        initialRepos={repos} 
      />
    </div>
  );
}