import { Box, Link, Text } from "@chakra-ui/react"
import { AlbumFilterField } from "@constants"
import NextLink from "next/link"

type AlbumDetailsProps = {
	title: AlbumFilterField
	details: string[]
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ title, details }) => {
	return (
		<Box w="full" lineHeight={1}>
			<Text textTransform="uppercase" letterSpacing={1} mb={2}>
				{`${title}${details.length > 1 ? "s" : ""}`}
			</Text>
			{details.map((detail) => (
				<NextLink
					href={{
						pathname: "/search",
						query: {
							[title]: detail,
						},
					}}
					passHref
					key={`${title}-${detail}`}
				>
					<Link
						title={`Search for albums with ${detail.toUpperCase()} as a ${title}`}
						display="block"
						color="gray.500"
						fontSize="sm"
						textTransform="uppercase"
						mb={2}
						_hover={{ color: "brand.900" }}
					>
						{detail}
					</Link>
				</NextLink>
			))}
		</Box>
	)
}

export default AlbumDetails
