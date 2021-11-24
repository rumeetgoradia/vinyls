import { User } from ".prisma/client"
import { encryptPassword, verifyPassword } from "@utils"
import { prisma } from "./prisma"

export type UserParams = {
	email: string
	name: string
	password: string
}

// Given some params, create a user on the database,
// storing the encrypted password.
export async function createUser(params: UserParams): Promise<User> {
	const { email, name, password } = params
	const encryptedPassword = await encryptPassword(password)
	const user = await prisma.user.create({
		data: { email, name, password: encryptedPassword },
	})

	user.password = ""

	return user
}

export type SignInParams = {
	email: string
	password: string
}

// Given some login params (email and password)
// return the user if the password is valid
// or null if it's not.
export async function signIn(params: SignInParams): Promise<User> {
	const user = await prisma.user.findUnique({ where: { email: params.email } })

	if (!user) return null

	if (await verifyPassword(user.password, params.password)) {
		user.password = ""

		return user
	}

	return null
}
