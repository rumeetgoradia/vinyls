import { PrismaClient } from "@prisma/client"
import { getPlaiceholder } from "plaiceholder"
import { albums, songs } from "./seed_data"

const prisma = new PrismaClient()

async function main() {
	await prisma.song.deleteMany({})
	await prisma.album.deleteMany({})

	await prisma.album.createMany({
		data: [...albums],
	})
	await prisma.song.createMany({
		data: [...songs],
	})

	const seededAlbums = await prisma.album.findMany()

	for (const album of seededAlbums) {
		try {
			if (!album.coverArtBase64) {
				const { base64 } = await getPlaiceholder(album.coverArtUrl)
				await prisma.album.update({
					where: { id: album.id },
					data: { coverArtBase64: base64 },
				})
				album.coverArtBase64 = base64
				console.log("base64 done for", album.title)
			}
		} catch (error) {
			console.log(album.title, album.coverArtUrl, error)
		}
	}
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect)
