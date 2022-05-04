import { Flex, Link, Text } from "@chakra-ui/react"

type FooterProps = {}

const Footer: React.FC<FooterProps> = ({}) => {
	return (
		<Flex as="footer" w="full" justify="center" py={2} bg="white">
			<Text fontSize="sm" color="gray.400">
				Created by{" "}
				<Link
					isExternal
					href="https://rumeetgoradia.com"
					_hover={{ color: "brand.900" }}
				>
					Rumeet Goradia
				</Link>
			</Text>
		</Flex>
	)
}

export default Footer
