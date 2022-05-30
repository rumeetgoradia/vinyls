import {
	Box,
	Flex,
	Grid,
	GridItem,
	Text,
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react"
import { SignInCredentials, SIGN_IN_ERROR_MESSAGES } from "@constants"
import { BuiltInProviderType } from "next-auth/providers"
import { signIn } from "next-auth/react"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types"
import { useForm } from "react-hook-form"
import { BiErrorCircle } from "react-icons/bi"
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
			<Grid gap={6} templateColumns="repeat(4, 1fr)" w="full">
				{Object.values(providers).map(({ id, name }) => (
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
				))}
			</Grid>
		</VStack>
	)
}

export default SignInForm
