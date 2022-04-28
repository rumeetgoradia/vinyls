import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

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
	],
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
})
