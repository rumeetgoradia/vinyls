import prisma from "@lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { verify } from "@node-rs/bcrypt"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import SpotifyProvider from "next-auth/providers/spotify"

declare module "next-auth" {
	interface User {
		password?: string
	}
}

export default NextAuth({
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID ?? "",
			clientSecret: process.env.FACEBOOK_SECRET ?? "",
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? "",
			clientSecret: process.env.GOOGLE_SECRET ?? "",
		}),
		SpotifyProvider({
			clientId: process.env.SPOTIFY_ID ?? "",
			clientSecret: process.env.SPOTIFY_SECRET ?? "",
		}),
		CredentialsProvider({
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "Enter your email",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Enter password",
				},
			},
			async authorize(credentials) {
				if (!credentials) return null

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				})

				if (!user) return null

				if (
					!user.password ||
					!(await verify(credentials.password, user.password))
				) {
					return null
				}

				user.password = null
				return user
			},
		}),
	],
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			return true
		},
	},
	session: {
		// Set to jwt in order to CredentialsProvider works properly
		strategy: "jwt",
	},
	secret: process.env.SECRET,
	pages: {
		signIn: "/account/signin",
	},
})

// Sign in / sign up
// can't register if email already exists.
// if logging in through credentials, if password doesn't exist or password is wrong --> wrong password error
// if logging in or registering through credentials and OAuth already exists (account exists but password doesn't) ->
