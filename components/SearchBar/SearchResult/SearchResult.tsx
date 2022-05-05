import { Box, Flex, Link, Text } from "@chakra-ui/react"
import { Album } from "@prisma/client"
import { createTransition } from "@utils"
import Image from "next/image"
import NextLink from "next/link"

type SearchResultProps = {
	album: Album
}

const SearchResult: React.FC<SearchResultProps> = ({
	album: { title, id, coverArtUrl, coverArtBase64, artists, price },
}) => {
	return (
		<NextLink href={`/albums/${id}`} passHref>
			<Link title={title} _hover={{}} _focus={{}}>
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
					<Box
						minW={{ base: "60px", sm: "80px" }}
						w={{ base: "60px", sm: "80px" }}
						mr={6}
					>
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
						<Text
							fontWeight={500}
							fontSize={{ base: "md", sm: "lg" }}
							lineHeight={1.15}
							my={1}
						>
							{title}
						</Text>
						<Text fontSize={{ base: "sm", sm: "md" }} lineHeight={1.15} mb={1}>
							{artists.join(", ")}
						</Text>
						<Text fontSize={{ base: "xs", sm: "sm" }} lineHeight={1}>
							${price}
						</Text>
					</Box>
				</Flex>
			</Link>
		</NextLink>
	)
}

export default SearchResult
