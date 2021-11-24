import { signIn } from "@lib/users"
import { NextApiRequest, NextApiResponse } from "next"
import defaultHandler from "./_defaultHandler"

const handler = defaultHandler<NextApiRequest, NextApiResponse>().post(
	async (req, res) => {
		const user = await signIn(req.body)

		if (user) {
			res.json(user)
		} else {
			res.status(404).send("")
		}
	}
)

export default handler
