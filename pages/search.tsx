import { Text, VStack } from "@chakra-ui/react"
import { AlbumsGrid } from "@components/AlbumsGrid"
import { Layout } from "@components/Layout"
import { SearchBar } from "@components/SearchBar"
import { AlbumFilterField, ALBUM_FILTER_FIELDS } from "@constants"
import { Album, PrismaClient } from "@prisma/client"
import { filterAlbums } from "@utils"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export async function getStaticProps() {
	const prisma = new PrismaClient()
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

	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>()

	useEffect(() => {
		if (!query && Object.keys(query).length === 0) {
			setLoading(true)
			return
		}

		for (const k of ALBUM_FILTER_FIELDS) {
			if (query[k] !== undefined && query[k] !== null) {
				setFilterField(k)
				setFilter(query[k])
				break
			}
		}

		setLoading(false)
	}, [query])

	useEffect(() => {
		if (!isLoading && filter && filterField) {
			setFilteredAlbums(filterAlbums(albums, filter, filterField))
		}
	}, [isLoading, albums, filter, filterField])

	const showResults = () => {
		if (isLoading) {
			return <Text>Loading...</Text>
		} else if (!filter || !filterField) {
			return <Text>Invalid search.</Text>
		} else if (!filteredAlbums) {
			return <Text>No results.</Text>
		} else {
			return <AlbumsGrid albums={filteredAlbums} />
		}
	}

	return (
		<Layout title="Search">
			<VStack spacing={10}>
				{/* <Text>
					{filter} {filterField}
				</Text> */}
				<SearchBar albums={albums} filter={filter} filterField={filterField} />
				{showResults()}
				{/* {isLoading ? (
					<Text>Loading...</Text>
				) : !filter || !filterField ? (
					<Text>Invalid search.</Text>
				) : filteredAlbums && filteredAlbums.length ? (
					<AlbumsGrid albums={filteredAlbums} />
				) : (
					<Text>No results</Text>
				)} */}
			</VStack>
		</Layout>
	)
}

export default SearchPage
