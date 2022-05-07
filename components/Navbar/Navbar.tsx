import {
	Box,
	ButtonProps,
	Container,
	Flex,
	HStack,
	IconButton,
	Text,
	useTheme,
} from "@chakra-ui/react"
import { transparentize } from "@chakra-ui/theme-tools"
import { createTransition } from "@utils"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IoIosSearch } from "react-icons/io"
import { IoCartOutline } from "react-icons/io5"
import { AccountPopover } from "./AccountPopover"

type NavbarProps = {}

const Navbar: React.FC<NavbarProps> = ({}) => {
	const [isScrolled, setScrolled] = useState<boolean>()

	const handleScroll = () => {
		const bodyScrollTop =
			document.documentElement.scrollTop || document.body.scrollTop
		const scrollThreshold = 82
		setScrolled(bodyScrollTop >= scrollThreshold)
	}

	useEffect(() => {
		handleScroll()
		window.addEventListener("scroll", handleScroll)

		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const router = useRouter()

	const theme = useTheme()

	const buttonProps: ButtonProps = {
		fontSize: "xl",
		bg: "transparent",
		color: "black",
		borderRadius: "0",
		_hover: {
			transform: "scale(1.1)",
			color: "brand.900",
			bg: "transparent",
		},
		_focus: {},
		_active: {
			transform: "scale(0.95)",
			bg: "transparent",
		},
		transition: createTransition(["transform", "color"]),
	}

	return (
		<Flex
			as="header"
			w="full"
			position="fixed"
			top={0}
			left={0}
			justify="center"
			zIndex="banner"
			bg={transparentize("white", 0.9)(theme)} //background
			backdropFilter="saturate(180%) blur(5px)"
			transition={createTransition("padding")}
			sx={{
				"@supports not (backdrop-filter: none)": {
					backdropFilter: "none",
					bg: "white",
				},
			}}
		>
			<Container maxW="container.lg" py={4} w="full">
				<Flex w="full" justify="space-between" align="center">
					<Box
						opacity={isScrolled || router.pathname !== "/" ? 1 : 0}
						pointerEvents={
							isScrolled || router.pathname !== "/" ? "all" : "none"
						}
						transition={createTransition("opacity")}
						userSelect="none"
					>
						<Link href="/" passHref>
							<Text
								as="a"
								fontSize={{ base: "2xl", sm: "3xl" }}
								fontWeight={250}
								lineHeight={1}
								cursor="pointer"
								title="rgVinyls"
							>
								<Box as="span" color="brand.900">
									rg
								</Box>
								Vinyls
							</Text>
						</Link>
					</Box>
					<HStack spacing={0.5}>
						{/* TODO add functionality */}
						<Link href="/cart" passHref>
							<IconButton
								as="a"
								icon={<IoCartOutline />}
								aria-label="Cart"
								title="Cart"
								{...buttonProps}
							/>
						</Link>
						<Link href="/search" passHref>
							<IconButton
								as="a"
								icon={<IoIosSearch />}
								aria-label="Search"
								title="Search"
								{...buttonProps}
							/>
						</Link>
						<AccountPopover buttonProps={buttonProps} />
					</HStack>
				</Flex>
			</Container>
		</Flex>
	)
}

export default Navbar
