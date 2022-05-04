import {
	Box,
	Flex,
	Grid,
	GridItem,
	Spacer,
	Stack,
	Text,
} from "@chakra-ui/react"
import { AddToCart, TrackList } from "@components/AlbumPage"
import { AlbumDetails } from "@components/AlbumPage/AlbumDetails"
import { Layout } from "@components/Layout"
import { Album, PrismaClient, Song } from "@prisma/client"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Image from "next/image"

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

	const songs = await prisma.song.findMany({
		where: {
			albumId: album.id,
		},
		orderBy: {
			numberOnAlbum: "asc",
		},
	})

	return {
		props: {
			album,
			songs,
		},
	}
}

type AlbumPageProps = {
	album: Album
	songs: Song[]
}
const AlbumPage: NextPage<AlbumPageProps> = ({
	album: {
		artists,
		coverArtBase64,
		coverArtUrl,
		genres,
		labels,
		price,
		producers,
		title,
		totalLength,
		year,
		description,
	},
	songs,
}) => {
	return (
		<Layout title={title}>
			<Grid gap={10} templateColumns="repeat(6, 1fr)">
				<GridItem colSpan={{ base: 6, sm: 3, md: 2 }}>
					<Box w="full">
						<Image
							src={coverArtUrl}
							width={500}
							height={500}
							layout="responsive"
							placeholder="blur"
							blurDataURL={coverArtBase64 || ""}
							alt={title}
						/>
					</Box>
				</GridItem>
				<GridItem colSpan={{ base: 6, sm: 3, md: 4 }}>
					<Flex w="full" h="full" direction="column" lineHeight={1}>
						<Text as="h1" fontSize="4xl" mb={4}>
							{title}
						</Text>
						<Text
							as="h4"
							fontSize="xl"
							color="gray.500"
							fontWeight={300}
							mb={4}
						>
							{year}
						</Text>
						<Text as="h2" fontSize="3xl" fontWeight={300} mb={4}>
							{artists.join(", ")}
						</Text>
						<Text as="h3" fontSize="2xl" mb={8}>
							${price}
						</Text>
						<Spacer />
						<AddToCart />
					</Flex>
				</GridItem>
				<GridItem colSpan={6}>
					<Text textAlign="justify">{description}</Text>
				</GridItem>
				<GridItem colSpan={{ base: 6, md: 4 }}>
					<Box w="full">
						<Text as="h5" fontSize="xl" fontWeight={500}>
							Track List
						</Text>
						<Box as="hr" width="20px" border="1px" mb={4} />
						<TrackList songs={songs} />
					</Box>
				</GridItem>
				<GridItem colSpan={{ base: 6, md: 2 }}>
					<Box w="full">
						<Text as="h5" fontSize="xl" fontWeight={500}>
							Details
						</Text>
						<Box as="hr" width="20px" border="1px" mb={4} />
						<Stack
							direction={{ base: "row", md: "column", lg: "row" }}
							w="full"
							justify="space-between"
							spacing={4}
						>
							<AlbumDetails
								title={`Genre${genres.length > 1 ? "s" : ""}`}
								details={genres}
							/>
							<AlbumDetails
								title={`Producer${producers.length > 1 ? "s" : ""}`}
								details={producers}
							/>
							<AlbumDetails
								title={`Label${labels.length > 1 ? "s" : ""}`}
								details={labels}
							/>
						</Stack>
					</Box>
				</GridItem>
			</Grid>
		</Layout>
	)
}

export default AlbumPage
