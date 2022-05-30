import { Box, Flex, Spinner, Text } from "@chakra-ui/react"
import { AlbumsGrid } from "@components/AlbumsGrid"
import { Layout } from "@components/Layout"
import { SearchBar } from "@components/SearchBar"
import { AlbumFilterField, ALBUM_FILTER_FIELDS } from "@constants"
import prisma from "@lib/prisma"
import { Album } from "@prisma/client"
import { createTransition, filterAlbums } from "@utils"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export async function getStaticProps() {
	const albums = await prisma.album.findMany({
		orderBy: [{ title: "asc" }],
	})

	return {
		props: { albums },
	}
}

type SearchPageProps = {
	albums: Album[]
}

type QueryType = {
	[K in AlbumFilterField]: string
}

const SearchPage: NextPage<SearchPageProps> = ({ albums }) => {
	const query: QueryType = useRouter().query as unknown as QueryType

	const [filterField, setFilterField] = useState<AlbumFilterField>()
	const [filter, setFilter] = useState<string>()
	const [isLoading, setLoading] = useState<boolean>(true)
	const [isBadQuery, setIsBadQuery] = useState<boolean>(false)

	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>([])

	useEffect(() => {
		const queryKeys = Object.keys(query)

		if (
			queryKeys.length > 0 &&
			// @ts-ignore
			queryKeys.some((key) => !ALBUM_FILTER_FIELDS.includes(key.toLowerCase()))
		) {
			setIsBadQuery(true)
		} else if (queryKeys.length === 0) {
			setFilter(undefined)
			setFilterField(undefined)
		} else {
			for (const k of ALBUM_FILTER_FIELDS) {
				if (query[k] !== undefined && query[k] !== null) {
					setFilterField(k)
					setFilter(query[k])
					break
				}
			}
		}

		setLoading(false)
	}, [query])

	useEffect(() => {
		if (!isLoading && filter && filterField) {
			setFilteredAlbums(filterAlbums(albums, filter, filterField))
		} else if (!isLoading) {
			setFilteredAlbums([])
		}
	}, [isLoading, albums, filter, filterField])

	const showResults = () => {
		if (isBadQuery) {
			return (
				<Box>
					<Text as="h2" color="gray.400" fontSize="2xl" mb={4}>
						Invalid query!
					</Text>
					<Text as="h3" color="gray.400" fontSize="xl" lineHeight={1}>
						Please use the search bar above to search through our inventory.
					</Text>
				</Box>
			)
		} else if (filter && filterField && filteredAlbums.length === 0) {
			return (
				<Box>
					<Text as="h2" color="gray.400" fontSize="2xl" mb={4}>
						No results found.
					</Text>
					<Text as="h3" color="gray.400" fontSize="xl" lineHeight={1}>
						Please try searching again with another query!
					</Text>
				</Box>
			)
		} else if (filteredAlbums.length > 0) {
			return <AlbumsGrid albums={filteredAlbums} />
		}
	}

	return (
		<Layout
			title="Search"
			pageHeader={
				!isLoading
					? `Search${filter && filterField ? ` results for "${filter}"` : ""}`
					: undefined
			}
		>
			<Flex
				justify="center"
				align="center"
				position="absolute"
				left={0}
				top={0}
				zIndex={100}
				bg="white"
				w="full"
				h="full"
				opacity={isLoading ? 1 : 0}
				pointerEvents={isLoading ? "all" : "none"}
				transition={createTransition("opacity", "ultra-slow", "ease-in-out")}
			>
				<Box transform="scale(2)">
					<Spinner
						thickness="1px"
						speed="0.65s"
						emptyColor="gray.200"
						color="brand.900"
						size="xl"
						label="Search results loading"
					/>
				</Box>
			</Flex>
			{!isLoading && (
				<>
					<SearchBar
						albums={albums}
						filter={filter}
						filterField={filterField}
					/>
					{showResults()}
				</>
			)}
		</Layout>
	)
}

export default SearchPage
