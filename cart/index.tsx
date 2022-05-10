import { AlbumInCart } from "@prisma/client"
import { useSession } from "next-auth/react"
import { createContext, useEffect, useState } from "react"
import redaxios from "redaxios"

// User not signed in --> add items to cart, push to cookie
// User signs in --> all items in cart gets pushed to user cart, cart cookie cleared
// User signs out --> cart context item cleared
export interface CartContextValues {
	cart: AlbumInCart[]
	getTotalSizeOfCart: () => number
	addAlbumToCart: (albumId: string, quantity?: number) => void
	removeAlbumFromCart: (albumId: string, quantity?: number) => void
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

	const isLoggedIn = (): boolean => {
		return !!session && !!session.user && status === "authenticated"
	}

	const mergeLocalAndDatabaseCarts = () => {
		if (!isLoggedIn()) {
			return
		}

		try {
			redaxios.get("/api/cart").then((res) => {
				const userCart: AlbumInCart[] = res.data.albumsInCart
				if (userCart.length === 0) {
					persistCart(cart)
				}
				for (let i = 0; i < userCart.length; ++i) {
					const { albumId, quantity } = userCart[i]
					addAlbumToCart(albumId, quantity, i === userCart.length - 1)
				}
			})
		} catch (e) {
			console.info(e)
		}
	}

	useEffect(() => {
		if (isLoggedIn()) {
			mergeLocalAndDatabaseCarts()
			window.localStorage.removeItem(LOCAL_STORAGE_KEY)
		} else {
			setCart(
				JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
			)
		}
	}, [status])

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

	const addAlbumToCart = (
		albumId: string,
		quantity: number = 1,
		persist: boolean = true
	): void => {
		const existingAlbumInCart = getAlbumInCartById(albumId)

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
				albumId: albumId,
				quantity,
			}
		}

		setCart((prev) => {
			const newCart = prev.find(
				(albumInCart) => albumInCart.albumId === albumId
			)
				? prev.map((albumInCart) =>
						albumInCart.albumId === albumId ? newAlbumInCart : albumInCart
				  )
				: [...prev, newAlbumInCart]
			if (persist) {
				persistCart(newCart)
			}
			return newCart
		})
	}

	const removeAlbumFromCart = (
		albumId: string,
		quantity: number = 1,
		persist: boolean = true
	): void => {
		const existingAlbumInCart = getAlbumInCartById(albumId)

		let newAlbumInCart: AlbumInCart

		if (existingAlbumInCart) {
			const { quantity: existingQuantity, ...existingDetails } =
				existingAlbumInCart
			newAlbumInCart = {
				...existingAlbumInCart,
				quantity: existingQuantity - quantity,
			}

			if (newAlbumInCart.quantity < 1) {
				setCart((prev) => {
					const newCart = prev.filter(
						(albumInCart) => albumInCart.albumId !== albumId
					)
					if (persist) {
						persistCart(newCart)
					}
					return newCart
				})
			} else {
				setCart((prev) => {
					const newCart = prev.map((albumInCart) =>
						albumInCart.albumId === albumId ? newAlbumInCart : albumInCart
					)
					if (persist) {
						persistCart(newCart)
					}
					return newCart
				})
			}
		}
	}

	const persistCart = (cart: AlbumInCart[] = []) => {
		console.log("persisting", isLoggedIn(), cart)
		if (isLoggedIn()) {
			redaxios
				.post("/api/cart", JSON.stringify(cart))
				.then((res) => console.log(res.status))
		} else {
			window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart))
		}
	}

	return (
		<CartContext.Provider
			value={{ cart, getTotalSizeOfCart, addAlbumToCart, removeAlbumFromCart }}
		>
			{children}
		</CartContext.Provider>
	)
}
