import { Album, PrismaClient } from "@prisma/client"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"

export const getStaticPaths: GetStaticPaths = async () => {
	const prisma = new PrismaClient()
	const albums = await prisma.album.findMany()

	const paths = albums.map((album) => {
		return {
			params: {
				albumId: album.id,
			},
		}
	})

	return {
		paths,
		fallback: true,
	}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const prisma = new PrismaClient()
	const album = await prisma.album.findUnique({
		where: {
			// @ts-ignore
			id: params?.albumId,
		},
	})

	if (!album) {
		return {
			notFound: true,
		}
	}

	return {
		props: {
			album,
		},
	}
}

type AlbumPageProps = {
	album: Album
}
const AlbumPage: NextPage<AlbumPageProps> = ({ album }) => {
	return <>{album.title}</>
}

export default AlbumPage
