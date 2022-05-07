import { Text, VStack } from "@chakra-ui/react"
import { SignInForm } from "@components/Account/Auth/SignInForm"
import { Layout } from "@components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { BuiltInProviderType } from "next-auth/providers"
import { getProviders, getSession } from "next-auth/react"
import { ClientSafeProvider, LiteralUnion } from "next-auth/react/types"

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
				<SignInForm
					providers={providers}
					callbackUrl={callbackUrl}
					error={error}
				/>
			</VStack>
		</Layout>
	)
}

export default SignInPage
