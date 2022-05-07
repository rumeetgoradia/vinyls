import { Layout } from "@components/Layout"
import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (!session) {
		return {
			redirect: {
				destination: "/auth/signin",
				permanent: false,
			},
		}
	}

	// TODO return account props

	return {
		props: { session },
	}
}

const AccountPage: NextPage = () => {
	return <Layout title="Account">Account</Layout>
}

export default AccountPage
