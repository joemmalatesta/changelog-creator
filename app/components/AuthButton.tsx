'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface Repository {
  id: number
  name: string
  html_url: string
}

export default function AuthButton() {
  const { data: session } = useSession()
  const [repos, setRepos] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  useEffect(() => {
    const fetchRepos = async () => {
      if (session?.access_token) {
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const data = await response.json()
        setRepos(data)
      }
    }
    if (repos.length === 0) {
      fetchRepos().catch(console.error)
    }
  }, [session])

  if (session) {
    return (
      <div>
        <div>
            <div className="flex gap-1">
         <p> Signed in as {session.user?.name} </p>
                <img src={session.user?.image || ''} alt="user image" className="w-10 h-10 rounded-full" />   
            </div>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        
        <div className="mt-4">
          <h2>Your Repositories:</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full p-2 border rounded mb-2"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredRepos = repos.filter(repo =>
                  repo.name.toLowerCase().includes(searchTerm)
                );
                setFilteredRepos(filteredRepos);
              }}
            />
            <div className="max-h-60 overflow-y-auto border rounded">
              {(filteredRepos || repos).map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-100 text-blue-500 hover:underline"
                >
                  {repo.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <button onClick={() => signIn('github')}>Sign in with GitHub</button>
  )
} 