import { CookieSerializeOptions, serialize } from "cookie"
import jwt from "jsonwebtoken"
import { NextApiResponse } from "next"

const JWT_SECRET = process.env.JWT_SECRET

export const createJWT = (payload: string | object): string => {
	const token = jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	})

	return token
}

export const verifyJWT = (token: string) => {
	const data = jwt.verify(token, JWT_SECRET)

	if (!data) {
		return undefined
	}

	return data
}

const cookieOptions: CookieSerializeOptions = {
	httpOnly: true,
	maxAge: 2592000,
	path: "/",
	sameSite: "strict",
	secure: process.env.NODE_ENV === "production",
}

export const setCookie = (
	res: any,
	name: string,
	value: string | object
): void => {
	const stringValue =
		typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value)

	res.setHeader(
		"Set-Cookie",
		serialize(name, String(stringValue), cookieOptions)
	)
}

export const clearCookie = (res: NextApiResponse, name: string): void => {
	res.setHeader(
		"Set-Cookie",
		serialize(name, "0", { ...cookieOptions, maxAge: 1 })
	)
}
