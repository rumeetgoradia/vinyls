import {
	Box,
	Button,
	ButtonProps,
	Flex,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Text,
	VStack,
} from "@chakra-ui/react"
import { ACCOUNT_LINKS } from "@constants"
import { createTransition } from "@utils"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BsPerson, BsPersonFill } from "react-icons/bs"
import { VscSignOut } from "react-icons/vsc"
type AccountPopoverProps = {
	buttonProps: ButtonProps
}

const AccountPopover: React.FC<AccountPopoverProps> = ({ buttonProps }) => {
	const { data: session } = useSession()
	const [isLoggedIn, setLoggedIn] = useState<boolean>(
		!!(session && session.user)
	)
	useEffect(() => {
		setLoggedIn(!!(session && session.user))
	}, [session])

	// TODO fill logic
	const register = () => {}

	const [popoverIsOpen, setPopoverIsOpen] = useState<boolean>(false)

	const openPopover = () => {
		setPopoverIsOpen(true)
	}

	const closePopover = () => {
		setPopoverIsOpen(false)
	}

	const router = useRouter()

	return (
		<Popover
			placement="bottom-end"
			returnFocusOnClose={false}
			isOpen={popoverIsOpen}
			onClose={closePopover}
		>
			{/* @ts-ignore */}
			<PopoverTrigger>
				<IconButton
					onClick={openPopover}
					icon={isLoggedIn ? <BsPersonFill /> : <BsPerson />}
					aria-label={isLoggedIn ? "Account" : "Sign in or register"}
					title={isLoggedIn ? "Account" : "Sign In / Register"}
					{...buttonProps}
				/>
			</PopoverTrigger>
			<PopoverContent
				borderRadius="0"
				border={isLoggedIn ? "none" : "1px"}
				boxShadow="none"
				_focus={{}}
			>
				<PopoverArrow bg={isLoggedIn ? "brand.900" : "white"} />
				{isLoggedIn && (
					<PopoverHeader bg="brand.900" border="none" px={4} py={2}>
						<Text color="white" fontWeight={600} fontSize="lg">
							{session?.user?.name}
						</Text>
					</PopoverHeader>
				)}
				<PopoverBody
					border={isLoggedIn ? "1px" : "none"}
					borderColor="gray.200"
					borderTop="none"
					boxShadow="none"
					p={0}
				>
					{isLoggedIn ? (
						<>
							{ACCOUNT_LINKS.map(({ title, path, icon }) => (
								<Link href={path} passHref key={`account-link-${title}`}>
									<Flex
										as="a"
										align="center"
										w="full"
										p={4}
										bg="white"
										_hover={{ bg: "gray.200" }}
										cursor="pointer"
										lineHeight={1}
										transition={createTransition("bg")}
									>
										<Box flexBasis="15px">{icon}</Box>
										<Text
											ml={4}
											fontWeight={500}
											fontSize="sm"
											letterSpacing={1}
											textTransform="uppercase"
										>
											{title}
										</Text>
									</Flex>
								</Link>
							))}
							<Flex
								onClick={() => signOut()}
								align="center"
								w="full"
								p={4}
								bg="white"
								_hover={{ bg: "gray.200" }}
								cursor="pointer"
								lineHeight={1}
								transition={createTransition("bg")}
							>
								<Box flexBasis="15px">
									<VscSignOut />
								</Box>
								<Text
									ml={4}
									fontWeight={500}
									fontSize="sm"
									letterSpacing={1}
									textTransform="uppercase"
								>
									Sign Out
								</Text>
							</Flex>
						</>
					) : (
						<VStack spacing={4} p={4}>
							<Button
								onClick={() => {
									if (router.pathname !== "/account/signin") signIn()
									closePopover()
								}}
								variant="ghost"
								w="full"
							>
								Sign In
							</Button>
							<Button
								onClick={() => {
									if (router.pathname !== "/account/register") register()
									closePopover()
								}}
								variant="outline"
								w="full"
							>
								Create Account
							</Button>
						</VStack>
					)}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	)
}

export default AccountPopover
