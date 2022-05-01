import { Container, Grid, GridItem, Text } from "@chakra-ui/react"
import { Album, PrismaClient } from "@prisma/client"
import type { NextPage } from "next"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { getPlaiceholder } from "plaiceholder"

export async function getStaticProps() {
	const prisma = new PrismaClient()
	const albums = await prisma.album.findMany({
		orderBy: [{ title: "asc" }],
	})

	for (const album of albums) {
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

	return {
		props: { albums },
	}
}

type HomePageProps = {
	albums: Album[]
}

const HomePage: NextPage<HomePageProps> = ({ albums }) => {
	const { data: session, status } = useSession()

	if (status === "authenticated") {
		return <p>Signed in as {session?.user?.email}</p>
	}

	return (
		<Container maxW="container.lg">
			<a href="/api/auth/signin">Sign in</a>
			<Text fontStyle="italic">
				Laborum sunt consequat est minim. Ut proident dolor tempor mollit irure.
				Labore excepteur fugiat laboris anim excepteur aliquip consectetur
				nostrud nulla cillum. Non ea proident adipisicing deserunt quis. Enim
				adipisicing minim minim eu eiusmod excepteur Lorem occaecat voluptate.
				Adipisicing laboris dolore nostrud est occaecat quis eu laborum laboris
				nostrud dolor consequat tempor.
			</Text>

			<Grid gap={6} templateColumns="repeat(3, 1fr)">
				{albums.map(({ title, artists, coverArtUrl, coverArtBase64 }) => (
					<GridItem colSpan={1} key={title}>
						<Image
							width={300}
							height={300}
							src={coverArtUrl}
							placeholder={coverArtBase64 ? "blur" : "empty"}
							blurDataURL={coverArtBase64 || ""}
							alt={title}
						/>

						<Text>{title}</Text>
						<Text fontSize="sm">{artists.join(",")}</Text>
					</GridItem>
				))}
			</Grid>
		</Container>
	)
}

export default HomePage
