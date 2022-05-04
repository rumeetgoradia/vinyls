import { Box, Link, Text, VStack } from "@chakra-ui/react"
import { AlbumsGrid } from "@components/Home"
import { Layout } from "@components/Layout"
import { SearchBar } from "@components/SearchBar"
import { Album, PrismaClient } from "@prisma/client"
import type { NextPage } from "next"
import { useSession } from "next-auth/react"

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
	const { data: session, status } = useSession()

	if (status === "authenticated") {
		return <p>Signed in as {session?.user?.email}</p>
	}

	return (
		<Layout>
			{/* <a href="/api/auth/signin">Sign in</a> */}
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
