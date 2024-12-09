## Changelog Generator
- This would work well as a CI step. 
- This would likely work better with PR's given the greater context added in comments and code review history.
  - That said, to minimize scope and because many of my personal projects lack decent PR's, I've focused on commits.

## Setup 
By adding a `.env` with the following values, it should work but I'm not going to spend a ton of time wiriting up a how to (unless requested)
```
GITHUB_ID = personal auth ID you get from https://github.com/settings/tokens
GITHUB_SECRET = personal auth token you get from ^^^^^
NEXTAUTH_URL = http://localhost:3000
NEXTAUTH_SECRET = Random key you create
JWT_SECRET = Likewise ^^^^ actually don't know if both are necessary
NEON_DATABASE_URL = obtained from making a db at neon.tech
OPENAI_API_KEY = sk-...
```
Byeond adding the values, you'll likely need to run `drizzlekit push` but again, untested for now.

## Tools
- Next
- Tailwind
- NextAuth
- Neon DB
- Drizzle ORM
- AI SDK (4o-mini)
- Cursor
- Vercel


## Complications
- Github repos have no unique identifier.
  - Using the repo name is not a good long term solution.
  - Not implemented, but to check if a repo exists with a name change, we can compare the initial commit SHA.
- Likewise, the github user does not come with a unique identifier.
  - Using the email is not a good long term solution either. 
  - I have indexed the email in the users table for the current implementation.
