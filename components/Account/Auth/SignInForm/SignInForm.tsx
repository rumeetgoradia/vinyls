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
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react"
import { PasswordField } from "@components/Form"
import {
	EMAIL_REGEX,
	SignInCredentials,
	SIGN_IN_ERROR_MESSAGES,
} from "@constants"
import { BuiltInProviderType } from "next-auth/providers"
import { signIn } from "next-auth/react"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types"
import { Controller, useForm } from "react-hook-form"
import { BiErrorCircle } from "react-icons/bi"
import { Or } from "../Or"
import { ProviderButton } from "../ProviderButton"

type SignInFormProps = {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>
	callbackUrl?: string
	error?: string
}

const SignInForm: React.FC<SignInFormProps> = ({
	callbackUrl,
	error,
	providers,
}) => {
	const {
		register,
		formState: { errors, isSubmitting },
		handleSubmit,
		control,
	} = useForm<SignInCredentials>()

	const orVariant = useBreakpointValue<"horizontal" | "vertical">({
		base: "horizontal",
		md: "vertical",
	})

	const onCredentialsSubmit = async (values: SignInCredentials) => {
		await signIn("credentials", {
			...values,
			callbackUrl,
		})
	}

	return (
		<VStack spacing={10} w="full" align="flex-start">
			{error && (
				<Box w={"full"} bg="red.700" p={4}>
					<Flex color="white" fontSize="lg" w="full" align="center">
						<BiErrorCircle />
						<Text as="h3" ml={4}>
							{SIGN_IN_ERROR_MESSAGES[error]}
						</Text>
					</Flex>
				</Box>
			)}
			<Grid w="full" templateColumns="repeat(6, 1fr)" gap={10}>
				<GridItem colSpan={{ base: 6, md: 3 }}>
					<Grid
						as="form"
						onSubmit={handleSubmit(onCredentialsSubmit)}
						gap={6}
						templateColumns="repeat(2, 1fr)"
						w="full"
					>
						<GridItem colSpan={2}>
							<FormControl isInvalid={!!errors.email}>
								<FormLabel mb={1}>Email</FormLabel>
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
						<GridItem colSpan={2}>
							<Controller
								control={control}
								name="password"
								rules={{ required: "Please enter your password." }}
								render={({ field }) => (
									<FormControl isInvalid={!!errors.password}>
										<FormLabel mb={1}>Password</FormLabel>
										<PasswordField {...field} outline="variant" />
										<FormErrorMessage color="red.600">
											{errors.password?.message}
										</FormErrorMessage>
									</FormControl>
								)}
							/>
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
				</GridItem>
				<GridItem colSpan={{ base: 6, md: 1 }}>
					<Or variant={orVariant} />
				</GridItem>

				<GridItem colSpan={{ base: 6, md: 2 }}>
					<Grid gap={6} templateColumns="repeat(4, 1fr)" w="full">
						{Object.values(providers).map(({ id, name }) => {
							if (id === "credentials") {
								return null
							}

							return (
								<GridItem colSpan={4} key={`sign-in-${id}`}>
									<ProviderButton
										prefix="Sign in"
										providerName={name}
										disabled={isSubmitting}
										onClick={() =>
											signIn(id, {
												callbackUrl: callbackUrl || "/account",
											})
										}
									/>
								</GridItem>
							)
						})}
					</Grid>
				</GridItem>
			</Grid>
		</VStack>
	)
}

export default SignInForm
