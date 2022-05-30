import { Box, Flex, Link, Text } from "@chakra-ui/react"
import { AlbumsGrid } from "@components/AlbumsGrid"
import { Layout } from "@components/Layout"
import { SearchBar } from "@components/SearchBar"
import prisma from "@lib/prisma"
import { Album } from "@prisma/client"
import type { NextPage } from "next"

export async function getStaticProps() {
	const albums = await prisma.album.findMany({
		orderBy: [{ title: "asc" }],
	})

	return {
		props: { albums },
	}
}

type HomePageProps = {
	albums: Album[]
}

const HomePage: NextPage<HomePageProps> = ({ albums }) => {
	return (
		<Layout>
			<Flex w="full" justify="center" align="center">
				<Text
					as="h1"
					fontSize={{ base: "7xl", sm: "8xl" }}
					fontWeight={200}
					lineHeight={1}
				>
					<Box
						as="span"
						color="brand.900"
						cursor="pointer"
						title="Rumeet Goradia"
					>
						<Link
							isExternal
							href="https://rumeetgoradia.com"
							_hover={{}}
							_focus={{}}
						>
							rg
						</Link>
					</Box>
					Vinyls
				</Text>
			</Flex>
			<SearchBar albums={albums} />
			<AlbumsGrid albums={albums} />
		</Layout>
	)
}

export default HomePage
