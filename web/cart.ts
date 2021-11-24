import { AlbumsInCarts } from ".prisma/client"
import * as Cookies from "js-cookie"
import { createJWT, setCookie, verifyJWT } from "./cookies"

type CartCookieContents = {
	albums: {
		id: string
		quantity: number
	}[]
}

const COOKIE_NAME = "cart"

export const setCartCookie = (albumsInCarts: AlbumsInCarts[]) => {
	setCookie(
		COOKIE_NAME,
		createJWT({
			albums: albumsInCarts.map((album) => ({
				id: album.albumId,
				quantity: album.quantity,
			})),
		})
	)
}

export const getCartFromCookie = (): AlbumsInCarts[] => {
	const cartCookie = Cookies.get(COOKIE_NAME)

	if (cartCookie) {
		return verifyJWT(cartCookie, async (data) => {
			const { albums } = data as CartCookieContents
			const albumsInCarts: AlbumsInCarts[] = []
			for (const album of albums) {
				albumsInCarts.push({
					albumId: album.id,
					quantity: album.quantity,
					userId: -1,
				})
			}
		}) as AlbumsInCarts[]
	}

	return []
}

export const clearCartCookie = () => {
	Cookies.remove(COOKIE_NAME)
}
