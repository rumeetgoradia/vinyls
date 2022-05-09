import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	IconButton,
	Select,
	Text,
} from "@chakra-ui/react"
import { AlbumPreview } from "@components/AlbumPreview"
import { Album } from "@prisma/client"
import { createTransition } from "@utils"
import { ChangeEvent, useEffect, useState } from "react"
import {
	VscChevronDown,
	VscChevronLeft,
	VscChevronRight,
} from "react-icons/vsc"
import { scroller } from "react-scroll"

type AlbumsGridProps = {
	albums: Album[]
}

const AlbumsGrid: React.FC<AlbumsGridProps> = ({ albums }) => {
	const resultsPerPageOptions = [12, 24, 36, 48]

	const [resultsPerPage, setResultsPerPage] = useState<number>(24)
	const [activeSlice, setActiveSlice] = useState<number>(0)
	const [numSlices, setNumSlices] = useState<number>(
		Math.ceil(albums.length / resultsPerPage)
	)

	const [letterFilters, setLetterFilters] = useState<string[]>([])
	const [filteredAlbums, setFilteredAlbums] = useState<Album[]>(albums)
	const [filter, setFilter] = useState<string>()

	const filterAlbums = (letter?: string) => {
		if (!letter || filter === letter) {
			setFilteredAlbums(albums)
			setFilter(undefined)
			return
		}

		if (letter === "#") {
			setFilteredAlbums(
				albums.filter(
					(album) => /^[a-zA-Z]+$/.test(album.title.charAt(0)) === false
				)
			)
		} else {
			setFilteredAlbums(
				albums.filter(
					(album) =>
						album.title.charAt(0).toUpperCase() === letter.toUpperCase()
				)
			)
		}
		setFilter(letter)
	}

	useEffect(() => {
		const letters = new Set<string>()
		let encounteredNonAlphaFirstLetter = false

		albums.forEach((album) => {
			const firstLetter = album.title.charAt(0).toUpperCase()
			if (/^[a-zA-Z]+$/.test(firstLetter)) {
				letters.add(firstLetter)
			} else {
				encounteredNonAlphaFirstLetter = true
			}
		})

		const newLetterFilters = Array.from(letters)
		if (encounteredNonAlphaFirstLetter) {
			newLetterFilters.push("#")
		}

		setLetterFilters(newLetterFilters.sort())

		filterAlbums()
	}, [albums])

	useEffect(() => {
		setActiveSlice(0)
		setNumSlices(Math.ceil(filteredAlbums.length / resultsPerPage))
	}, [filteredAlbums, resultsPerPage])

	const scrollToTop = () => {
		scroller.scrollTo("filters", {
			smooth: true,
			delay: 1,
			duration: 0,
			offset: -24,
		})
	}

	return (
		<Box w="full">
			<Flex
				w="full"
				justify="center"
				flexWrap="wrap"
				// @ts-ignore
				name="filters"
			>
				{letterFilters.length > 1 &&
					letterFilters.map((letter) => {
						const isActive = filter === letter

						return (
							<Button
								key={`filter-${letter}`}
								onClick={() => filterAlbums(letter)}
								aria-label={`Albums starting with ${
									letter === "#" ? "a non-alphabetic character" : letter
								}`}
								variant="unstyled"
								position="relative"
								fontWeight={400}
								display="flex"
								justifyContent="center"
								alignItems="center"
								mx={0.5}
								p={1}
								h="auto"
								size="sm"
								borderRadius={0}
								color={isActive ? "brand.900" : "black"}
								_hover={{ transform: `scale(${isActive ? 1 : 1.25})` }}
								_focus={{}}
								_after={{
									content: '""',
									w: isActive ? "90%" : 0,
									h: "1px",
									bg: "brand.900",
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									transition: createTransition("width"),
								}}
								transition={createTransition([
									"transform",
									"color",
									"background",
								])}
							>
								{letter}
							</Button>
						)
					})}
			</Flex>
			<Grid
				gap={6}
				my={6}
				templateColumns={{
					base: "repeat(2, 1fr)",
					sm: "repeat(3, 1fr)",
					md: "repeat(4, 1fr)",
				}}
			>
				{filteredAlbums
					.slice(
						activeSlice * resultsPerPage,
						Math.min((activeSlice + 1) * resultsPerPage, filteredAlbums.length)
					)
					.map((album) => (
						<GridItem colSpan={1} key={`preview-${album.title}`}>
							<AlbumPreview album={album} />
						</GridItem>
					))}
			</Grid>
			<Flex w="full" justify="space-between" align="flex-end">
				<Box>
					<Text fontSize="xs">Results per page</Text>
					<Select
						value={resultsPerPage}
						onChange={(e: ChangeEvent<HTMLSelectElement>) =>
							setResultsPerPage(parseInt(e.target.value))
						}
						icon={<VscChevronDown />}
						variant="unstyled"
						w="auto"
					>
						{resultsPerPageOptions.map((option) => (
							<option
								value={option}
								key={`results-per-page-selector-${option}`}
							>
								{option}
							</option>
						))}
					</Select>
				</Box>
				<Flex justify="center" align="center">
					<IconButton
						icon={<VscChevronLeft />}
						onClick={() => {
							setActiveSlice((prev) => prev - 1)
							scrollToTop()
						}}
						aria-label="Previous Page"
						disabled={activeSlice === 0}
						variant="unstyled"
						mr={6}
						display="flex"
						justifyContent="center"
						alignItems="center"
						bg="none"
						borderRadius="50%"
						_hover={{ transform: `scale(${activeSlice === 0 ? 1 : 1.25})` }}
						_focus={{}}
						transition={createTransition("transform")}
					/>
					<Select
						value={activeSlice}
						onChange={(e: ChangeEvent<HTMLSelectElement>) => {
							setActiveSlice(parseInt(e.target.value))
							scrollToTop()
						}}
						icon={<VscChevronDown />}
						variant="unstyled"
						w="auto"
					>
						{[...Array(numSlices).keys()].map((slice) => (
							<option value={slice} key={`page-selector-${slice}`}>
								{slice + 1}
							</option>
						))}
					</Select>
					<IconButton
						icon={<VscChevronRight />}
						onClick={() => {
							setActiveSlice((prev) => prev + 1)
							scrollToTop()
						}}
						aria-label="Next Page"
						disabled={activeSlice === numSlices - 1}
						variant="unstyled"
						ml={3}
						display="flex"
						justifyContent="center"
						alignItems="center"
						bg="none"
						borderRadius="50%"
						_hover={{
							transform: `scale(${activeSlice === numSlices - 1 ? 1 : 1.25})`,
						}}
						_focus={{}}
						transition={createTransition("transform")}
					/>
				</Flex>
			</Flex>
		</Box>
	)
}

export default AlbumsGrid
