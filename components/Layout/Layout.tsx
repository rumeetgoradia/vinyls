import { Box, Container } from "@chakra-ui/react"
import { NextSeo } from "next-seo"

type LayoutProps = {
	title?: string
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
	return (
		<>
			<NextSeo title={title} />
			<Container
				maxW="container.lg"
				pt={{ base: "calc(1.5rem + 59px)", sm: "calc(1.5rem + 64px)" }}
				pb={8}
				minH="calc(100vh - 37px)"
			>
				<Box w="full">{children}</Box>
			</Container>
		</>
	)
}

export default Layout
