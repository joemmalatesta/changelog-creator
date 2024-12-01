## Changelog Generator
- This would work well as a CI step. 
- This would likely work better with PR's given the greater context added in comments and code review history.
  - That said, to minimize scope and because many of my personal projects lack decent PR's, I've focused on commits.


## Tools
- Next
- Tailwind
- NextAuth
- Neon DB
- AI SDK
- Cursor
- Vercel


## Complications
- Github repos have no unique identifier.
  - Using the repo name is not a good long term solution.
  - Not implemented, but to check if a repo exists with a name change, we can compare the initial commit SHA.
- Likewise, the github user does not come with a unique identifier.
  - Using the email is not a good long term solution either. 
  - I have indexed the email in the users table for the current implementation.
