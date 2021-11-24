import { prisma } from "@lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import defaultHandler from "./_defaultHandler"

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
	.post(async (req, res) => {
		const { userId, albumId, quantity, increment } = req.body
		await prisma.albumsInCarts.upsert({
			where: {
				userId_albumId: {
					userId,
					albumId,
				},
			},
			create: {
				userId,
				albumId,
				quantity,
			},
			update: {
				quantity: increment ? { increment: quantity } : quantity,
			},
		})
		const userWithCart = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			include: {
				albumsInCart: true,
			},
		})
		return res.json(userWithCart.albumsInCart)
	})
	.delete(async (req, res) => {
		const { albumId, userId } = req.body
		await prisma.albumsInCarts.delete({
			where: {
				userId_albumId: {
					userId,
					albumId,
				},
			},
		})

		return res.status(200)
	})

export default handler
