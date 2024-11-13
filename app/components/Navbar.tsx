'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { cookies } from 'next/headers'
import { ThemeManager } from './ThemeManager'

interface Repository {
  id: number
  name: string
  html_url: string
}

export default function Navbar() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // useEffect(() => {
  //   const fetchRepos = async () => {
  //     if (session?.access_token) {
  //       const response = await fetch('https://api.github.com/user/repos', {
  //         headers: {
  //           Authorization: `Bearer ${session.access_token}`,
  //         },
  //       })
  //       const data = await response.json()
  //       setRepos(data)
  //     }
  //   }
  //   if (repos.length === 0) {
  //     fetchRepos().catch(console.error)
  //   }
  // }, [session])

  

  

  if (session) {
    return (
            <div className="flex justify-end items-center gap-3 ">
               <ThemeManager />
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
                        <img src={session.user?.image || ''} alt="user image" className="w-9 h-9 rounded-full hover:opacity-80 transition-opacity" />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                            <button
                                onClick={() => signOut()}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                   

                </div>
                 
        {/* <div className="mt-4">
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
          </div> */}
        </div>
    )
  }
  return (
    <div className="flex justify-end">
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      <ThemeManager />
    </div>
  )
}