import { Album, AlbumInCart } from "@prisma/client"
import { useSession } from "next-auth/react"
import { createContext, useEffect, useState } from "react"

// User not signed in --> add items to cart, push to cookie
// User signs in --> all items in cart gets pushed to user cart, cart cookie cleared
// User signs out --> cart context item cleared
export interface CartContextValues {
	cart: AlbumInCart[]
	getTotalSizeOfCart: () => number
	addAlbumToCart: (album: Album, quantity?: number) => void
	removeAlbumFromCart: (album: Album, quantity?: number) => void
}

const defaultContext: CartContextValues = {
	cart: [],
	getTotalSizeOfCart: () => 0,
	addAlbumToCart: () => {},
	removeAlbumFromCart: () => {},
}

export const CartContext = createContext<CartContextValues>(defaultContext)

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const LOCAL_STORAGE_KEY = "RGVINYLS_CART"

	const [cart, setCart] = useState<AlbumInCart[]>([])

	const { data: session, status } = useSession()

	useEffect(() => {
		if (isLoggedIn()) {
			// TODO create function to get cart from endpoint
		} else {
			setCart(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
			)
		}
	}, [])

	useEffect(() => {
		if (isLoggedIn()) {
			// TODO get cart from API, create copy of current cart, add
		}
	}, [session, status])

	const isLoggedIn = (): boolean => {
		return !!session && !!session.user && status === "authenticated"
	}

	const getTotalSizeOfCart = (): number => {
		let size = 0
		cart.forEach((albumInCart) => {
			size += albumInCart.quantity
		})

		return size
	}

	const getAlbumInCartById = (id: string): AlbumInCart | undefined => {
		return cart.find((albumInCart) => albumInCart.albumId === id)
	}

	const addAlbumToCart = (album: Album, quantity: number = 1): void => {
		const existingAlbumInCart = getAlbumInCartById(album.id)

		let newAlbumInCart: AlbumInCart

		if (existingAlbumInCart) {
			const { quantity: existingQuantity, ...existingDetails } =
				existingAlbumInCart
			newAlbumInCart = {
				...existingAlbumInCart,
				quantity: existingQuantity + quantity,
			}
		} else {
			newAlbumInCart = {
				userId: "",
				albumId: album.id,
				quantity,
			}
		}

		setCart((prev) =>
			prev.find((albumInCart) => albumInCart.albumId === album.id)
				? prev.map((albumInCart) =>
						albumInCart.albumId === album.id ? newAlbumInCart : albumInCart
				  )
				: [...prev, newAlbumInCart]
		)

		// TODO set cookie every time cart changes, or if session exists, send request to cart update endpoint
		updateCartInLocalStorage()
	}

	const removeAlbumFromCart = (album: Album, quantity: number = 1): void => {
		const existingAlbumInCart = getAlbumInCartById(album.id)

		let newAlbumInCart: AlbumInCart

		if (existingAlbumInCart) {
			const { quantity: existingQuantity, ...existingDetails } =
				existingAlbumInCart
			newAlbumInCart = {
				...existingAlbumInCart,
				quantity: existingQuantity - quantity,
			}

			if (newAlbumInCart.quantity < 1) {
				setCart((prev) =>
					prev.filter((albumInCart) => albumInCart.albumId !== album.id)
				)
			} else {
				setCart((prev) =>
					prev.map((albumInCart) =>
						albumInCart.albumId === album.id ? newAlbumInCart : albumInCart
					)
				)
			}
		}
		// TODO set cookie every time cart changes, or if session exists, send request to cart update endpoint
		updateCartInLocalStorage()
	}

	const updateCartInLocalStorage = () => {
		window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart))
	}

	return (
		<CartContext.Provider
			value={{ cart, getTotalSizeOfCart, addAlbumToCart, removeAlbumFromCart }}
		>
			{children}
		</CartContext.Provider>
	)
}
