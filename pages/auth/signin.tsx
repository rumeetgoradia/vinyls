import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Text,
	VStack,
} from "@chakra-ui/react"
import { Layout } from "@components/Layout"
import { EMAIL_REGEX, PROVIDER_COLOR_SCHEMES } from "@constants"
import { GetServerSideProps, NextPage } from "next"
import { getProviders, getSession, signIn } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { BuiltInProviderType } from "../../node_modules/next-auth/providers"
import {
	ClientSafeProvider,
	LiteralUnion,
} from "../../node_modules/next-auth/react/types"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (session) {
		return {
			redirect: {
				destination: "/account",
				permanent: false,
			},
		}
	}

	const providers = await getProviders()

	let { callbackUrl = null, error = null } = context.query
	if (Array.isArray(callbackUrl)) callbackUrl = callbackUrl[0]
	if (Array.isArray(error)) error = error[0]

	return {
		props: { callbackUrl, error, providers },
	}
}

type SignInPageProps = {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>
	callbackUrl?: string
	error?: string
}

type SignInCredentials = {
	email: string
	password: string
}

const SignInPage: NextPage<SignInPageProps> = ({
	callbackUrl,
	error,
	providers,
}) => {
	const {
		register,
		formState: { errors, isSubmitting },
		handleSubmit,
	} = useForm<SignInCredentials>()
	const [showPassword, setShowPassword] = useState<boolean>(false)

	const onCredentialsSubmit = async (values: SignInCredentials) => {
		await signIn("credentials", {
			...values,
			callbackUrl,
		})
	}

	const errorMessages: { [k: string]: string } = {
		Signin: "Try signing with a different account.",
		OAuthSignin: "Try signing with a different account.",
		OAuthCallback: "Try signing with a different account.",
		OAuthCreateAccount: "Try signing with a different account.",
		EmailCreateAccount: "Try signing with a different account.",
		Callback: "Try signing with a different account.",
		OAuthAccountNotLinked:
			"To confirm your identity, sign in with the same account you used originally.",
		CredentialsSignin:
			"Sign in failed. Check the details you provided are correct.",
		default: "Unable to sign in.",
	}

	return (
		<Layout title="Sign In">
			<VStack spacing={10} align="flex-start">
				<Text
					as="h1"
					fontWeight={300}
					fontSize={{ base: "4xl", md: "5xl" }}
					lineHeight={1.15}
				>
					Sign In
				</Text>
				<Grid
					as="form"
					onSubmit={handleSubmit(onCredentialsSubmit)}
					gap={6}
					templateColumns="repeat(2, 1fr)"
					w="full"
				>
					{error && (
						<GridItem colSpan={2}>
							<Text as="h3" color="red.600" fontSize="xl">
								{errorMessages[error]}
							</Text>
						</GridItem>
					)}
					<GridItem colSpan={1}>
						<FormControl isInvalid={!!errors.email}>
							<FormLabel>Email</FormLabel>
							<Input
								variant="outline"
								type="email"
								{...register("email", {
									required: "Please enter your email address.",
									pattern: {
										value: EMAIL_REGEX,
										message: "Please enter a valid email address.",
									},
								})}
							/>
							<FormErrorMessage color="red.600">
								{errors.email?.message}
							</FormErrorMessage>
						</FormControl>
					</GridItem>
					<GridItem colSpan={1}>
						<FormControl isInvalid={!!errors.password}>
							<FormLabel>Password</FormLabel>
							<Input
								variant="outline"
								// TODO incorporate show password logic
								type="text"
								{...register("password", {
									required: "Please enter your password.",
								})}
							/>
							<FormErrorMessage color="red.600">
								{errors.password?.message}
							</FormErrorMessage>
						</FormControl>
					</GridItem>
					<GridItem colSpan={2}>
						<Button
							variant="ghost"
							type="submit"
							w="full"
							isLoading={isSubmitting}
							disabled={isSubmitting}
							loadingText="Signing in..."
						>
							Sign In
						</Button>
					</GridItem>
				</Grid>
				<Flex justify="center" w="full" position="relative">
					<Box
						color="gray.600"
						bg="white"
						pl={4}
						pr="calc(1rem - 2px)"
						position="relative"
						zIndex={5}
					>
						<Text letterSpacing={2} fontSize="xl">
							OR
						</Text>
					</Box>
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
				</Flex>
				<Grid gap={6} templateColumns="repeat(4, 1fr)" w="full">
					{Object.values(providers).map(({ id, name }) => {
						if (id === "credentials") {
							return null
						}

						const providerName = name.toLowerCase()
						const baseColor = PROVIDER_COLOR_SCHEMES[providerName]?.base
						const hoverColor = PROVIDER_COLOR_SCHEMES[providerName]?.hover

						return (
							<GridItem
								colSpan={{ base: 4, sm: 2, lg: 1 }}
								key={`sign-in-${id}`}
							>
								<Button
									disabled={isSubmitting}
									title={`Sign in with ${name}`}
									variant="ghost"
									w="full"
									bg={baseColor || "brand.900"}
									_hover={{
										bg: hoverColor || "brand.800",
										_disabled: {
											bg: baseColor || "brand.900",
										},
									}}
									_active={{
										bg: hoverColor || "brand.800",
										transform: "scale(0.975)",
										_disabled: {
											bg: baseColor || "brand.900",
											transform: "scale(1)",
										},
									}}
									onClick={() =>
										signIn(id, {
											callbackUrl: callbackUrl || "/account",
										})
									}
								>
									Sign in with {name}
								</Button>
							</GridItem>
						)
					})}
				</Grid>
			</VStack>
		</Layout>
	)
}

export default SignInPage
