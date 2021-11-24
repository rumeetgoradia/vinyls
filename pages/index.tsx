import { User } from ".prisma/client"
import { Button } from "@chakra-ui/button"
import { Text } from "@chakra-ui/layout"
import { getUserFromCookie } from "@web"
import type { GetServerSidePropsContext, NextPage } from "next"
import redaxios from "redaxios"
import superjson from "superjson"

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const user = await getUserFromCookie()
	if (!user) return { props: {} }

	// Always use superjson as Next.js
	// can't serialize prisma objects by default
	return {
		props: superjson.serialize({
			user,
		}).json,
	}
}

type HomePageProps = {
	user?: User
}

const HomePage: NextPage<HomePageProps> = ({ user }) => {
	const handleLogout = () => redaxios.delete("/api/sessions")
	return (
		<main>
			{user ? (
				<>
					<Text>hello {user.name}</Text>
					<Button type="button" onClick={handleLogout}>
						Logout
					</Button>
				</>
			) : (
				<>
					<Text>Not logged in</Text>
					<Button type="button"></Button>{" "}
				</>
			)}
		</main>
	)
}

export default HomePage
