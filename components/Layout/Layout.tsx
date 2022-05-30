import { Container, Text, VStack } from "@chakra-ui/react"
import { NextSeo } from "next-seo"

type LayoutProps = {
	title?: string
	pageHeader?: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, pageHeader, children }) => {
	return (
		<>
			<NextSeo title={title} />
			<Container
				maxW="container.lg"
				pt={{ base: "calc(1.5rem + 59px)", sm: "calc(1.5rem + 64px)" }}
				pb={8}
				position="relative"
				minH="calc(100vh - 37px)"
			>
				<VStack spacing={10} align="flex-start">
					{pageHeader && (
						<Text as="h1" fontSize="4xl">
							{pageHeader}
						</Text>
					)}
					{children}
				</VStack>
			</Container>
		</>
	)
}

export default Layout
