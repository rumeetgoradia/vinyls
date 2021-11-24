import { Album, User } from ".prisma/client"
import { prisma } from "@lib/prisma"
import { parse } from "cookie"
import { verify } from "jsonwebtoken"
import { GetServerSideProps, NextPage } from "next"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { auth } = parse(context.req.headers.cookie)

	try {
		const decoded = verify(auth, process.env.JWT_SECRET)
		const id = parseInt(decoded.sub as string)
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				name: true,
				orders: true,
				email: true,
			},
		})
		user.orders.forEach((order) => {
			order.datePlaced = JSON.parse(JSON.stringify(order.datePlaced))
		})

		const albumsInCarts = await prisma.albumsInCarts.findMany({
			where: {
				userId: id,
			},
			select: {
				album: true,
			},
		})
		const cart = albumsInCarts.flatMap((albumInCart) => albumInCart.album)

		return {
			props: {
				user,
				cart,
			},
		}
	} catch (err) {
		console.log(err)
		return {
			props: {
				user: {},
			},
			// redirect: {
			// 	destination: "/signin",
			// 	permanent: false,
			// },
		}
	}
}

type AccountPageProps = {
	user: User
	cart: Album[]
}

const AccountPage: NextPage<AccountPageProps> = ({ user, cart }) => {
	console.log(user)
	console.log(cart)
	return <>account</>
}

export default AccountPage
