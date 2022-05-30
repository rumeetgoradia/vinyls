import { Box, Flex, Text } from "@chakra-ui/react"
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

type SignInPageProps = {
	providers: Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	>
	callbackUrl?: string
	error?: string
}

const SignInPage: NextPage<SignInPageProps> = ({
	callbackUrl,
	error,
	providers,
}) => {
	return (
		<Layout title="Sign In" pageHeader="Sign In">
			<SignInForm
				providers={providers}
				callbackUrl={callbackUrl}
				error={error}
			/>
			<Flex align="center" w="full" direction="row">
				<Text mr={2}>New user?</Text>
				<NextLink href="/account/register" passHref>
					<Flex
						as="a"
						title="Create Account"
						color="brand.900"
						align="center"
						role="group"
						_focus={{}}
					>
						Create an account{" "}
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
		</Layout>
	)
}

export default SignInPage
