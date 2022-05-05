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
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IoIosSearch } from "react-icons/io"
import { IoCartOutline, IoLogInOutline, IoLogOutOutline } from "react-icons/io5"
import { VscAccount } from "react-icons/vsc"

type NavbarProps = {}

const Navbar: React.FC<NavbarProps> = ({}) => {
	const { data: session } = useSession()

	const [isScrolled, setScrolled] = useState<boolean>()

	const router = useRouter()

	const handleScroll = () => {
		const bodyScrollTop =
			document.documentElement.scrollTop || document.body.scrollTop
		const scrollThreshold = 82
		// @ts-ignore
		setScrolled(bodyScrollTop >= scrollThreshold)
	}

	useEffect(() => {
		handleScroll()
		window.addEventListener("scroll", handleScroll)

		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

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
						{session ? (
							<>
								<Link href="/account" passHref>
									<IconButton
										as="a"
										icon={<VscAccount />}
										aria-label="Account"
										title="Account"
										{...buttonProps}
									/>
								</Link>
								<IconButton
									icon={<IoLogOutOutline />}
									aria-label="Log Out"
									title="Log Out"
									{...buttonProps}
								/>
							</>
						) : (
							<Link href="/login" passHref>
								<IconButton
									as="a"
									icon={<IoLogInOutline />}
									aria-label="Log In or Register"
									title="Log In / Register"
									{...buttonProps}
								/>
							</Link>
						)}
					</HStack>
				</Flex>
			</Container>
		</Flex>
	)
}

export default Navbar
