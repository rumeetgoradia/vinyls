import { Album, User } from ".prisma/client"
import { Button } from "@chakra-ui/button"
import { Box, Text } from "@chakra-ui/layout"
import useServerRefresher from "@hooks/useServerRefresher"
import { prisma } from "@lib/prisma"
import { getUserFromCookie } from "@web"
import { useSession } from "context/session"
import type { GetServerSidePropsContext, NextPage } from "next"
import Link from "next/link"
import { useEffect } from "react"
import { useMutation } from "react-query"
import redaxios, { Response } from "redaxios"
import superjson from "superjson"

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const userFromCookie = await getUserFromCookie(context.req)
	const featuredAlbums = await prisma.album.findMany({
		where: {
			isFeatured: true,
		},
		orderBy: {
			id: "asc",
		},
		select: {
			title: true,
			artists: true,
			id: true,
			price: true,
			coverArtUrl: true,
		},
	})

	return {
		props: superjson.serialize({
			userFromCookie,
			featuredAlbums,
		}).json,
	}
}

type HomePageProps = {
	userFromCookie?: User
	featuredAlbums: Album[]
}

const HomePage: NextPage<HomePageProps> = ({
	userFromCookie,
	featuredAlbums,
}) => {
	const serverRefresher = useServerRefresher()

	const { user, signIn, signOut } = useSession()

	useEffect(() => {
		signIn(userFromCookie)
	})

	const {
		isLoading,
		isError,
		mutate: signOutMutation,
	} = useMutation(() => redaxios.delete("/api/session"), {
		onSuccess: (data: Response<User>) => {
			signOut()
			serverRefresher()
		},
	})

	return (
		<main>
			{user ? (
				<>
					<Text>hello {user.name}</Text>
					<Button type="button" onClick={() => signOutMutation()}>
						Logout
					</Button>
				</>
			) : (
				<>
					<Text>Not logged in</Text>
					<Link href="/register" passHref>
						<Button type="button">Sign In</Button>
					</Link>
				</>
			)}
			<Box>
				{featuredAlbums.map((album) => (
					<Box>{album.title}</Box>
				))}
			</Box>
		</main>
	)
}

export default HomePage
