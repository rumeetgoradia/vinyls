import { PrismaClient } from "@prisma/client"
import { albums } from "./seed_data/albums"
import { songs } from "./seed_data/songs"

const prisma = new PrismaClient()

async function main() {
	await prisma.album.deleteMany()
	await prisma.album.createMany({
		data: [...albums],
	})

	await prisma.song.deleteMany()
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
