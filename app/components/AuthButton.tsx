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

  useEffect(() => {
    console.log('session', session)
    console.log('access token', session?.access_token)
    const fetchRepos = async () => {
        console.log('fetching repos')
      if (session?.access_token) {
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const data = await response.json()
        console.log('repos', data)
        setRepos(data)
      }
    }

    fetchRepos().catch(console.error)
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
          <ul className="list-disc pl-5">
            {repos.map((repo) => (
              <li key={repo.id}>
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {repo.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  return (
    <button onClick={() => signIn('github')}>Sign in with GitHub</button>
  )
} 