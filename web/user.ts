import { User } from ".prisma/client"
import { prisma } from "@lib/prisma"
import * as Cookies from "js-cookie"
import { createJWT, setCookie, verifyJWT } from "./cookies"

const COOKIE_NAME = "user"

export const setUserCookie = (user: User) => {
	setCookie(COOKIE_NAME, createJWT({ email: user.email }))
}

export const getUserFromCookie = (): User => {
	const userCookie = Cookies.get(COOKIE_NAME)

	if (userCookie) {
		return verifyJWT(userCookie, async (data) => {
			const user = await prisma.user.findUnique({
				where: { email: (data as any).email },
			})

			if (user) {
				user.password = ""
			}

			return user
		}) as User
	}

	return undefined
}

export const clearUserCookie = () => {
	Cookies.remove(COOKIE_NAME)
}
