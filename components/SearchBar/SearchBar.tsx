import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	useOutsideClick,
} from "@chakra-ui/react"
import { Album } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { IoIosSearch } from "react-icons/io"
import { SearchResult } from "./SearchResult"

type SearchBarProps = {
	albums: Album[]
}

const SearchBar: React.FC<SearchBarProps> = ({ albums }) => {
	const [filter, setFilter] = useState<string>()
	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>()

	useEffect(() => {
		if (!filter || filter.trim().length === 0) {
			setFilteredAlbums([])
			return
		}

		const maxResults = 100

		const lowerCaseFilter = filter.toLowerCase()
		const FILTERS: ((album: Album) => boolean)[] = [
			(album) => album.title.toLowerCase().startsWith(lowerCaseFilter),
			(album) => album.title.toLowerCase().includes(lowerCaseFilter),
			(album) =>
				album.artists.some((artist) =>
					artist.toLowerCase().startsWith(lowerCaseFilter)
				),
			(album) =>
				album.artists.some((artist) =>
					artist.toLowerCase().includes(lowerCaseFilter)
				),
		]

		const newFilteredAlbums: Album[] = []
		for (const f of FILTERS) {
			const filterResults = albums
				.filter(f)
				.filter((album) =>
					newFilteredAlbums.every(
						(filteredAlbum) => filteredAlbum.id !== album.id
					)
				)
			newFilteredAlbums.push(...filterResults)

			if (newFilteredAlbums.length >= maxResults) {
				break
			}
		}

		setFilteredAlbums(newFilteredAlbums.slice(0, maxResults))
	}, [filter])

	const [resultsOpen, setResultsOpen] = useState<boolean>(false)
	const [isFocused, setFocused] = useState<boolean>(false)

	const ref = useRef<HTMLDivElement>()
	useOutsideClick({
		// @ts-ignore
		ref: ref,
		handler: () => {
			setFocused(false)
			setResultsOpen(false)
		},
	})

	return (
		<Box
			w="full"
			position="relative"
			zIndex={3}
			role="group"
			// @ts-ignore
			ref={ref}
		>
			<InputGroup size="lg">
				<Input
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					onFocus={() => {
						setFocused(true)
						setResultsOpen(true)
					}}
					onBlur={() => setFocused(false)}
					placeholder="Search by title or artist..."
					variant="outline"
					borderRadius="0"
					focusBorderColor="black"
					transition="none"
				/>
				<InputRightElement>
					<Box color={isFocused ? "black" : "gray.400"}>
						<IoIosSearch />
					</Box>
				</InputRightElement>
			</InputGroup>
			{resultsOpen && filteredAlbums && filteredAlbums.length > 0 && (
				<Box
					w="full"
					position="absolute"
					left={0}
					top="calc(100% - 1px)"
					bg="white"
					border="1px"
					borderColor={isFocused ? "black" : "gray.200"}
					boxShadow={
						isFocused ? "1px 1px 0px black, -1px 1px 0px black" : "none"
					}
					borderTop="none"
					_groupHover={{
						borderColor: isFocused ? "black" : "gray.300",
					}}
					zIndex={4}
				>
					<Box w="full" maxH="40vh" overflowY="auto" className="with-scrollbar">
						{filteredAlbums?.map((album) => (
							<SearchResult album={album} key={`filtered-album-${album.id}`} />
						))}
					</Box>
				</Box>
			)}
		</Box>
	)
}

export default SearchBar
