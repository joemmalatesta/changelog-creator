import NextAuth, { NextAuthOptions, Session, Account, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
			authorization: {
				params: {
					scope: 'read:user user:email repo:read'
				}
			}
		}),
	],
	callbacks: {
		async session({ session, token }: { session: Session; token: JWT }): Promise<Session & { access_token?: string }> {
			return {
				...session,
				access_token: token.access_token as string
			}
		},
		async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
			if (account) {
				token.access_token = account.access_token
			}
			return token
		}
	}
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
