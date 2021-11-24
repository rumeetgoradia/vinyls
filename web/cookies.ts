import * as Cookies from "js-cookie"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export const createJWT = (payload: string | object): string => {
	const token = jwt.sign(payload, JWT_SECRET, {
		expiresIn: "1d",
	})

	return token
}

export const verifyJWT = (
	token: string,
	callback: (data: string | jwt.JwtPayload) => {}
) => {
	const data = jwt.verify(token, JWT_SECRET)

	if (!data) {
		return undefined
	}

	return callback(data)
}

const cookieOptions: Cookies.CookieAttributes = {
	httpOnly: true,
	expires: 30,
	path: "/",
	sameSite: "Strict",
	secure: process.env.NODE_ENV === "production",
}

export const setCookie = (name: string, value: string | object): void => {
	const stringValue =
		typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value)

	Cookies.remove(name)
	Cookies.set(name, stringValue, cookieOptions)
}
