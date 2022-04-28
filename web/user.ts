import { User } from ".prisma/client"
import { prisma } from "@lib/prisma"
import { IncomingMessage } from "http"
import { NextApiResponse } from "next"
import { NextApiRequestCookies } from "next/dist/server/api-utils"
import { clearCookie, createJWT, setCookie, verifyJWT } from "./cookies"

export const USER_COOKIE_NAME = "user"

export const setUserCookie = (res: NextApiResponse, user: User): void => {
	if (!user) return

	const { name, email } = user
	const token = createJWT({ name, email })

	setCookie(res, USER_COOKIE_NAME, token)
}

export const getUserFromCookie = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<User | undefined> => {
	const { [USER_COOKIE_NAME]: token } = req.cookies

	if (!token) return undefined

	try {
		const data = verifyJWT(token)

		if (!data) return undefined

		const user = await prisma.user.findUnique({
			where: { email: (data as any).email },
		})

		if (user) user.password = ""

		return user
	} catch (error) {
		return undefined
	}
}

export const clearUserCookie = (res: NextApiResponse) => {
	clearCookie(res, USER_COOKIE_NAME)
}
