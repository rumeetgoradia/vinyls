import { DetailedAlbumInCart } from "@constants"
import prisma from "@lib/prisma"
import { AlbumInCart } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import defaultHandler from "../_defaultHandler"

type ResponseData = {
	albumsInCart?: DetailedAlbumInCart[]
	error?: string
}

const handler = defaultHandler<
	NextApiRequest,
	NextApiResponse<ResponseData>
>().post(async (req, res) => {
	const cart: AlbumInCart[] = JSON.parse(req.body)

	const albumsInCart: DetailedAlbumInCart[] = []
	for (const albumInCart of cart) {
		const album = await prisma.album.findUnique({
			where: { id: albumInCart.albumId },
		})
		// @ts-ignore
		albumsInCart.push({ ...album, quantity: albumInCart.quantity })
	}

	res.status(200).send({ albumsInCart })
})

export default handler
