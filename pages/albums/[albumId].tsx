import {
	Box,
	Flex,
	Grid,
	GridItem,
	Link,
	Spacer,
	Stack,
	Text,
} from "@chakra-ui/react"
import { AddToCart, TrackList } from "@components/AlbumPage"
import { AlbumDetails } from "@components/AlbumPage/AlbumDetails"
import { Layout } from "@components/Layout"
import prisma from "@lib/prisma"
import { Album, Song } from "@prisma/client"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Image from "next/image"
import NextLink from "next/link"

export const getStaticPaths: GetStaticPaths = async () => {
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
						<Box mb={4}>
							<NextLink
								href={{
									pathname: "/search",
									query: {
										year,
									},
								}}
								passHref
							>
								<Link
									title={`Search for albums from ${year}`}
									display="inline-block"
									fontSize="xl"
									color="gray.500"
									fontWeight={300}
									_hover={{ color: "brand.900" }}
								>
									{year}
								</Link>
							</NextLink>
						</Box>
						<Box as="h2" fontSize="3xl" fontWeight={300} mb={4}>
							{artists.map((artist, index) => (
								<Box as="span" key={`${title}-${artist}`}>
									{index !== 0 && ","}
									<NextLink
										href={{
											pathname: "/search",
											query: {
												artist,
											},
										}}
										passHref
									>
										<Link
											title={`Search for albums by ${artist}`}
											_hover={{ color: "brand.900" }}
										>
											{artist}
										</Link>
									</NextLink>
								</Box>
							))}
						</Box>
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
							<AlbumDetails title="genre" details={genres} />
							<AlbumDetails title="producer" details={producers} />
							<AlbumDetails title="label" details={labels} />
						</Stack>
					</Box>
				</GridItem>
			</Grid>
		</Layout>
	)
}

export default AlbumPage
