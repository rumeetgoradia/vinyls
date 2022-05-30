import { Box, Text } from "@chakra-ui/react"
import { Layout } from "@components/Layout"
import prisma from "@lib/prisma"
import { Album, User } from "@prisma/client"
import { GetServerSideProps, NextPage } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (!session || !session.user) {
		return {
			redirect: {
				destination: "/account/signin",
				permanent: false,
			},
		}
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email! },
		select: {
			id: true,
			name: true,
			orders: {
				orderBy: { datePlaced: "desc" },
				select: { albums: { select: { album: true } } },
			},
		},
	})

	return {
		props: { user },
	}
}

type AccountPageProps = {
	user: User & {
		orders: {
			albums: {
				album: Album
			}[]
		}[]
	}
}

const AccountPage: NextPage<AccountPageProps> = ({ user }) => {
	const [recentlyPurchasedAlbums, setRecentlyPurchasedAlbums] = useState<
		Album[]
	>([])

	useEffect(() => {
		console.log(user)
		for (const order of user.orders) {
		}
	})

	return (
		<Layout title="Account" pageHeader={user.name!}>
			<Box w="full">
				<Text as="h2" fontSize="2xl">
					Recently Purchased
				</Text>
			</Box>
		</Layout>
	)
}

export default AccountPage
