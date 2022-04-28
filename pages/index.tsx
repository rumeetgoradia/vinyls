import type { NextPage } from "next"
import { useSession } from "next-auth/react"

const HomePage: NextPage = () => {
	const { data: session, status } = useSession()

	if (status === "authenticated") {
		return <p>Signed in as {session?.user?.email}</p>
	}

	return <a href="/api/auth/signin">Sign in</a>
}

export default HomePage
