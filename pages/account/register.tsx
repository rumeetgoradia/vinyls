import { Box, Flex, Text, VStack } from "@chakra-ui/react"
import { SignInForm } from "@components/Account/Auth/SignInForm"
import { Layout } from "@components/Layout"
import { createTransition } from "@utils"
import { GetServerSideProps, NextPage } from "next"
import { BuiltInProviderType } from "next-auth/providers"
import { getProviders, getSession } from "next-auth/react"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types"
import NextLink from "next/link"
import { BsArrowRight } from "react-icons/bs"

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

type RegisterPageProps = {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>
	callbackUrl?: string
	error?: string
}

const RegisterPage: NextPage<RegisterPageProps> = ({
	callbackUrl,
	error,
	providers,
}) => {
	return (
		<Layout title="Create Account">
			<VStack spacing={10} align="flex-start">
				<Text
					as="h1"
					fontWeight={300}
					fontSize={{ base: "4xl", md: "5xl" }}
					lineHeight={1.15}
				>
					Create Account
				</Text>
				<SignInForm
					providers={providers}
					callbackUrl={callbackUrl}
					error={error}
				/>
				<Flex align="center" w="full" direction="row">
					<Text mr={2}>Already have an account?</Text>
					<NextLink href="/account/signin" passHref>
						<Flex
							as="a"
							title="Sign In"
							color="brand.900"
							align="center"
							role="group"
							_focus={{}}
						>
							Sign in{" "}
							<Box
								ml={2}
								transition={createTransition("margin")}
								_groupHover={{
									ml: 3,
								}}
							>
								<BsArrowRight />
							</Box>
						</Flex>
					</NextLink>
				</Flex>
			</VStack>
		</Layout>
	)
}

export default RegisterPage
