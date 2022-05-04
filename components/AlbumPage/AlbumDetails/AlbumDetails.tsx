import { Box, Text } from "@chakra-ui/react"

type AlbumDetailsProps = {
	title: string
	details: string[]
}

const AlbumDetails: React.FC<AlbumDetailsProps> = ({ title, details }) => {
	return (
		<Box w="full" lineHeight={1}>
			<Text textTransform="uppercase" letterSpacing={1} mb={2}>
				{title}
			</Text>
			{details.map((detail) => (
				<Text
					color="gray.500"
					fontSize="sm"
					textTransform="uppercase"
					mb={2}
					key={`${title}-${detail}`}
				>
					{detail}
				</Text>
			))}
		</Box>
	)
}

export default AlbumDetails
