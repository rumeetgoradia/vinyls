import {
	Box,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	useOutsideClick,
} from "@chakra-ui/react"
import { AlbumFilterField, ALBUM_FILTER_FIELDS } from "@constants"
import { Album } from "@prisma/client"
import { createTransition, filterAlbums } from "@utils"
import { useRouter } from "next/router"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import { IoIosSearch } from "react-icons/io"
import { VscChevronDown } from "react-icons/vsc"
import { SearchResult } from "./SearchResult"

type SearchBarProps = {
	albums: Album[]
	filter?: string
	filterField?: AlbumFilterField
	maxResults?: number
}

const SearchBar: React.FC<SearchBarProps> = ({
	albums,
	filter: passedFilter,
	filterField: passedFilterField,
	maxResults = 100,
}) => {
	const [filter, setFilter] = useState<string>(passedFilter || "")
	const [filterField, setFilterField] = useState<AlbumFilterField>(
		passedFilterField || "title"
	)
	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>()

	useEffect(() => {
		if (!filter || filter.trim().length === 0) {
			setFilteredAlbums([])
			return
		}

		setFilteredAlbums(
			filterAlbums(albums, filter, filterField).slice(0, maxResults)
		)
	}, [filter, filterField])

	useEffect(() => {
		if (passedFilter) {
			setFilter(passedFilter)
		}
	}, [passedFilter])

	useEffect(() => {
		if (passedFilterField) {
			setFilterField(passedFilterField)
		}
	}, [passedFilterField])

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && searchIsPossible()) {
			setResultsOpen(false)
			initiateSearch()
		}
	}

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

	const searchIsPossible = () => {
		return filteredAlbums && filteredAlbums.length > 0
	}

	const router = useRouter()

	const initiateSearch = () => {
		if (filter) {
			setResultsOpen(false)
			router.push({
				pathname: "/search",
				query: { [filterField]: filter },
			})
		}
	}

	return (
		<Box
			w="full"
			position="relative"
			role="group"
			// @ts-ignore
			ref={ref}
		>
			<Box
				position="absolute"
				top="-1px"
				left="-1px"
				border="1px"
				borderColor={isFocused ? "black" : "transparent"}
				zIndex={1}
				h="calc(100% + 2px)"
				w="calc(100% + 2px)"
				transition=""
			>
				<Box w="full" h="full" position="relative"></Box>
			</Box>
			<Flex
				w="full"
				border="1px"
				borderColor={isFocused ? "black" : "gray.200"}
				_groupHover={{ borderColor: isFocused ? "black" : "gray.300" }}
				transition=""
			>
				<Select
					size="lg"
					onFocus={() => {
						setFocused(true)
						setResultsOpen(true)
					}}
					onBlur={() => setFocused(false)}
					icon={<VscChevronDown />}
					variant="outline"
					zIndex={4}
					position="relative"
					borderRadius="0"
					border="none"
					w={{ base: "150px", md: "140px", lg: "130px" }}
					fontSize={{ base: "xs", sm: "sm" }}
					textTransform="uppercase"
					fontWeight={500}
					letterSpacing={1}
					value={filterField}
					onChange={(e: ChangeEvent<HTMLSelectElement>) =>
						setFilterField(e.target.value as AlbumFilterField)
					}
					_hover={{}}
					_focus={{}}
				>
					{ALBUM_FILTER_FIELDS.map((field) => (
						<Box as="option" key={`${field}`}>
							{field}
						</Box>
					))}
				</Select>
				<Box w="full" flexGrow={1} position="relative" zIndex={4}>
					<InputGroup size="lg">
						<Input
							value={filter}
							onKeyDown={handleKeyDown}
							onChange={(e) => setFilter(e.target.value)}
							onFocus={() => {
								setFocused(true)
								setResultsOpen(true)
							}}
							onBlur={() => setFocused(false)}
							fontSize="md"
							placeholder={`Search by ${filterField.toLowerCase()}...`}
							variant="outline"
							borderRadius="0"
							transition="none"
							border="none"
							_hover={{}}
							_focus={{}}
						/>
						<InputRightElement>
							<IconButton
								onClick={initiateSearch}
								icon={<IoIosSearch />}
								aria-label="Search"
								title="Search"
								bg="white"
								borderRadius="0"
								pointerEvents={isFocused || searchIsPossible() ? "all" : "none"}
								color={isFocused || searchIsPossible() ? "black" : "gray.400"}
								_hover={{
									transform:
										isFocused || searchIsPossible() ? "scale(1.1)" : "",
								}}
								_active={{
									transform:
										isFocused || searchIsPossible() ? "scale(0.95)" : "",
								}}
								_focus={{}}
								transition={createTransition("transform")}
							/>
						</InputRightElement>
					</InputGroup>
				</Box>
			</Flex>
			{resultsOpen && searchIsPossible() && (
				<Box
					w="full"
					position="absolute"
					left="0"
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
					zIndex={5}
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
