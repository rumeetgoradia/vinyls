import { Box, Flex, Spacer, Text } from "@chakra-ui/react"
import { Song } from "@prisma/client"

type TrackListProps = {
	songs: Song[]
}

const TrackList: React.FC<TrackListProps> = ({ songs }) => {
	return (
		<Box w="full">
			{songs.map(({ numberOnAlbum, title, length, albumId }) => (
				<Flex
					w="full"
					py={4}
					pr={2}
					lineHeight={1}
					borderBottom="1px"
					borderColor="gray.200"
					key={`${albumId}-album-${title}-song`}
				>
					<Box flexBasis="15px" flexShrink={0} pt="2px">
						<Text
							fontWeight={900}
							fontSize="xs"
							textAlign="right"
							color="gray.400"
						>
							{numberOnAlbum}
						</Text>
					</Box>
					<Box mx={4}>
						<Text>{title}</Text>
					</Box>
					<Spacer />
					<Box>
						<Text color="gray.400" fontStyle="italic">
							{length}
						</Text>
					</Box>
				</Flex>
				// <Box
				// 	borderTop="1px"
				// 	borderBottom="1px"
				// 	borderColor="gray.200"

				// 	key={`${albumId}-album-${title}-song`}
				// >
				// 	<Text>{title}</Text>
				// </Box>
			))}
		</Box>
	)
}

export default TrackList
