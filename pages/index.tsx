import { Box, Link, Text, VStack } from "@chakra-ui/react"
import { AlbumsGrid } from "@components/AlbumsGrid"
import { Layout } from "@components/Layout"
import { SearchBar } from "@components/SearchBar"
import { Album, PrismaClient } from "@prisma/client"
import type { NextPage } from "next"

export async function getStaticProps() {
	const prisma = new PrismaClient()
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
			<VStack spacing={10}>
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
				<SearchBar albums={albums} />
				<AlbumsGrid albums={albums} />
			</VStack>
		</Layout>
	)
}

export default HomePage
