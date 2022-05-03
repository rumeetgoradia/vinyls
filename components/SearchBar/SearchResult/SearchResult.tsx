import { Box, Flex, Text } from "@chakra-ui/react"
import { Album } from "@prisma/client"
import { createTransition } from "@utils"
import Image from "next/image"
import Link from "next/link"

type SearchResultProps = {
	album: Album
}

const SearchResult: React.FC<SearchResultProps> = ({
	album: { title, id, coverArtUrl, coverArtBase64, artists, price },
}) => {
	return (
		<Link href={`/albums/${id}`} passHref>
			<Flex
				cursor="pointer"
				bg="white"
				py={4}
				px={8}
				_hover={{
					bg: "gray.100",
				}}
				transition={createTransition("background")}
			>
				<Box minW="80px" w="80px" mr={6}>
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
				<Box>
					<Text fontWeight={500} fontSize="lg" lineHeight={1.15} my={1}>
						{title}
					</Text>
					<Text lineHeight={1.15} mb={1}>
						{artists.join(", ")}
					</Text>
					<Text fontSize="sm" lineHeight={1}>
						${price}
					</Text>
				</Box>
			</Flex>
		</Link>
	)
}

export default SearchResult
