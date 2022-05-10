import prisma from "@lib/prisma"
import { AlbumInCart } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import defaultHandler from "./_defaultHandler"

type ResponseData = {
	albumsInCart?: AlbumInCart[]
	error?: string
}

const handler = defaultHandler<NextApiRequest, NextApiResponse<ResponseData>>()
	.get(async (req, res) => {
		const session = await getSession({ req })
		const email = session?.user?.email
		if (!session || !email) {
			res.status(401).send({ albumsInCart: [], error: "Not signed in." })
			return
		}

		const albumsInCart = await prisma.albumInCart.findMany({
			where: {
				user: {
					email,
				},
			},
		})
		res.status(200).send({ albumsInCart })
	})
	.post(async (req, res) => {
		const session = await getSession({ req })
		const email = session?.user?.email
		if (!session || !email) {
			res.status(401).send({ error: "Not signed in." })
			return
		}

		const cart: AlbumInCart[] = JSON.parse(req.body)

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) {
			res.status(401).send({ error: "Not signed in." })
			return
		}

		for (const albumInCart of cart) {
			albumInCart.userId = user.id
			await prisma.albumInCart.upsert({
				where: {
					userId_albumId: {
						userId: user.id,
						albumId: albumInCart.albumId,
					},
				},
				create: albumInCart,
				update: albumInCart,
			})
		}

		res.status(200).send({})
	})

export default handler
