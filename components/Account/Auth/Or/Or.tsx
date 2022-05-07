import { Box, Flex, Text } from "@chakra-ui/react"
type OrProps = {
	variant?: "horizontal" | "vertical"
}

const Or: React.FC<OrProps> = ({ variant = "horizontal" }) => {
	const isHorizontal = variant === "horizontal"

	return (
		<Flex
			justify="center"
			align="center"
			w={isHorizontal ? "full" : "auto"}
			h={isHorizontal ? "auto" : "full"}
			position="relative"
		>
			<Box
				color="gray.600"
				bg="white"
				pl={4}
				pr="calc(1rem - 2px)"
				py={4}
				position="relative"
				zIndex={5}
			>
				<Text letterSpacing={2} fontSize="xl">
					OR
				</Text>
			</Box>
			{isHorizontal ? (
				<Box
					h="1px"
					w="full"
					position="absolute"
					top="50%"
					left={0}
					transform="translateY(-50%)"
					bg="gray.400"
					zIndex={4}
				/>
			) : (
				<Box
					h="full"
					w="1px"
					position="absolute"
					top="0"
					left="50%"
					transform="translateX(-50%)"
					bg="gray.400"
					zIndex={4}
				/>
			)}
		</Flex>
	)
}

export default Or
