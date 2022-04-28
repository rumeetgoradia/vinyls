import { signIn } from "@lib/users"
import { clearUserCookie, setUserCookie } from "@web"
import { NextApiRequest, NextApiResponse } from "next"
import defaultHandler from "./_defaultHandler"

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
	.post(async (req, res) => {
		const user = await signIn(req.body)

		if (user) {
			setUserCookie(res, user)
			res.json(user)
		} else {
			res.status(404).send("")
		}
	})
	.delete((_req, res) => {
		clearUserCookie(res)
		res.send("")
	})

export default handler
