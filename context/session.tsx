import { Album, AlbumsInCarts, User } from ".prisma/client"
import React, { useContext, useState } from "react"

type SessionContextType = {
	user?: User
	cart?: AlbumsInCarts[]
	signIn?: (User) => void
	signOut?: () => void
	addToCart?: (string, number) => void
	removeFromCart?: (string) => void
	getCartAlbumsInfo?: () => { [key: string]: Album }
}
const SessionContext = React.createContext<SessionContextType>({})

export const SessionProvider: React.FC = ({ children }) => {
	const [user, setUser] = useState<User>()
	// const [cart, setCart] = useState<AlbumsInCarts[]>()

	const signIn = (user: User) => {
		setUser(user)
	}

	const signOut = () => {
		setUser(undefined)
	}

	// type AddToCartParams = {
	// 	albumId: string
	// 	quantity: number
	// 	increment?: boolean
	// }
	// const addToCart = async (params: AddToCartParams) => {
	// 	const { albumId, increment, quantity } = params
	// 	let newCart: AlbumsInCarts[] = []

	// 	if (user) {
	// 		newCart = await addToUserCart(albumId, quantity, increment)
	// 	} else {
	// 		newCart = await addToCookieCart(albumId, quantity, increment)
	// 	}

	// 	setCart(newCart)
	// }

	// type RemoveFromCartParams = {
	// 	albumId: string
	// }
	// const removeFromCart = async (params: RemoveFromCartParams) => {
	// 	const { albumId } = params
	// 	let newCart: AlbumsInCarts[] = []

	// 	if (user) {
	// 		newCart = await removeFromUserCart(albumId)
	// 	} else {
	// 		newCart = await removeFromCookieCart(albumId)
	// 	}

	// 	setCart(newCart)
	// }

	// const { mutate: addToUserCartMutation } = useMutation(
	// 	(params: AddToCartParams & { userId: number }) =>
	// 		redaxios.post("/api/cart", params)
	// )

	// const addToUserCart = async (
	// 	albumId: string,
	// 	quantity: number,
	// 	increment?: boolean
	// ): Promise<AlbumsInCarts[]> => {
	// 	let newCart = []

	// 	if (user) {
	// 		addToUserCartMutation(
	// 			{ albumId, quantity, increment, userId: user.id },
	// 			{
	// 				onSuccess: (data: Response<AlbumsInCarts[]>) => {
	// 					newCart = data.data
	// 				},
	// 			}
	// 		)
	// 	}

	// 	return newCart
	// }

	// const addToCookieCart = async (
	// 	albumId: string,
	// 	quantity: number,
	// 	increment?: boolean
	// ): Promise<AlbumsInCarts[]> => {
	// 	let newCart: AlbumsInCarts[] = []

	// 	if (!user) {
	// 		const matchingAlbumsInCart = cart.filter((aic) => aic.albumId === albumId)

	// 		if (matchingAlbumsInCart?.length) {
	// 			const match = { ...matchingAlbumsInCart[0] }
	// 			match.quantity = increment ? match.quantity + quantity : quantity
	// 			const nonMatchingAlbumsInCart = cart.filter(
	// 				(aic) => aic.albumId !== albumId
	// 			)
	// 			newCart = [...nonMatchingAlbumsInCart, match]
	// 		} else {
	// 			newCart = [
	// 				...cart,
	// 				{
	// 					albumId,
	// 					quantity,
	// 					userId: -1,
	// 				},
	// 			]
	// 		}
	// 	}

	// 	setCartCookie(newCart)
	// 	return newCart
	// }

	// const { mutate: removeFromUserCartMutation } = useMutation(
	// 	(params: RemoveFromCartParams & { userId: number }) =>
	// 		redaxios.delete("/api/cart", { params })
	// )

	// const removeFromUserCart = async (
	// 	albumId: string
	// ): Promise<AlbumsInCarts[]> => {
	// 	let newCart = []

	// 	if (user) {
	// 		removeFromUserCartMutation(
	// 			{ albumId, userId: user.id },
	// 			{
	// 				onSuccess: (data: Response<AlbumsInCarts[]>) => {
	// 					newCart = cart.filter((aic) => aic.albumId !== albumId)
	// 				},
	// 			}
	// 		)
	// 	}

	// 	return newCart
	// }

	// const removeFromCookieCart = async (
	// 	albumId: string
	// ): Promise<AlbumsInCarts[]> => {
	// 	let newCart = []

	// 	if (!user) {
	// 		newCart = cart.filter((aic) => aic.albumId !== albumId)
	// 	}

	// 	setCartCookie(newCart)
	// 	return newCart
	// }

	// const getCartAlbumsInfo = (): { [key: string]: Album } => {
	// 	const albumsInfo = {}

	// 	for (const albumInCart of cart) {
	// 		prisma.album
	// 			.findUnique({
	// 				where: {
	// 					id: albumInCart.albumId,
	// 				},
	// 			})
	// 			.then((album) => {
	// 				albumsInfo[albumInCart.albumId] = album
	// 			})
	// 	}

	// 	return albumsInfo
	// }

	return (
		<SessionContext.Provider
			value={{
				user,
				signIn,
				signOut,
				// cart,
				// signIn,
				// signOut,
				// addToCart,
				// removeFromCart,
				// getCartAlbumsInfo,
			}}
		>
			{children}
		</SessionContext.Provider>
	)
}

export const useSession = () => {
	return useContext(SessionContext)
}
