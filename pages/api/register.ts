import { createUser } from "@lib/users"
import { setUserCookie } from "@web"
import { NextApiRequest, NextApiResponse } from "next"
import defaultHandler from "./_defaultHandler"

const handler = defaultHandler<NextApiRequest, NextApiResponse>().post(
	async (req, res) => {
		const user = await createUser(req.body)

		setUserCookie(res, user)
		res.json(user)
	}
)

export default handler
