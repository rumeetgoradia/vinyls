import { PrismaClient } from "@prisma/client"
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
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect)
