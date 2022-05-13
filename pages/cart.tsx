import { CartContext, CartContextValues } from "@cart"
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { AlbumPreviewInCart } from "@components/Cart"
import { Layout } from "@components/Layout"
import { DetailedAlbumInCart } from "@constants"
import { AlbumInCart } from "@prisma/client"
import { NextPage } from "next"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { BsArrowRight } from "react-icons/bs"
import { IoCartOutline } from "react-icons/io5"
import redaxios from "redaxios"

const CartPage: NextPage = () => {
	const {
		cart: cartFromContext,
		addAlbumToCart,
		removeAlbumFromCart,
		setQuantityOfAlbumInCart,
	} = useContext<CartContextValues>(CartContext)

	const [cart, setCart] = useState<DetailedAlbumInCart[]>([])

	const getAlbumDetails = async (
		cart: AlbumInCart[]
	): Promise<DetailedAlbumInCart[]> => {
		const res = await redaxios.post("/api/cart/details", JSON.stringify(cart))
		const detailedAlbumsInCart: DetailedAlbumInCart[] = res.data.albumsInCart
		return detailedAlbumsInCart
	}

	useEffect(() => {
		if (cartFromContext) {
			getAlbumDetails(cartFromContext).then((value) => setCart(value))
		}
	}, [cartFromContext])

	const getTotalPriceOfCart = () => {
		let price = 0
		cart.forEach((a) => {
			price += a.price * a.quantity
		})

		return price
	}

	return (
		<Layout title="Cart">
			<VStack spacing={10} align="flex-start">
				<Text as="h1" fontSize="4xl">
					Cart
				</Text>
				{cart && cart.length ? (
					<>
						<Box w="full">
							{cart.map((albumInCart) => (
								<Box w="full" key={`${albumInCart.id}-in-cart`}>
									<AlbumPreviewInCart
										album={albumInCart}
										addAlbumToCart={addAlbumToCart}
										removeAlbumFromCart={removeAlbumFromCart}
										setQuantityOfAlbumInCart={setQuantityOfAlbumInCart}
									/>
								</Box>
							))}
						</Box>
						<Flex justify="space-between" w="full" mt={6} px={4}>
							<Box>
								<Text fontSize="2xl">Cart Subtotal</Text>
								<Text>Shipping and taxes calculated at checkout.</Text>
							</Box>
							<Box>
								<Text fontSize="2xl" fontWeight={600} textAlign="right">
									${getTotalPriceOfCart().toFixed(2)}
								</Text>
							</Box>
						</Flex>
						{/* TODO checkout page */}
						<Flex w="full" justify="flex-end" mt={4} px={4}>
							<Button variant="ghost" rightIcon={<BsArrowRight />} size="lg">
								Check Out
							</Button>
						</Flex>
					</>
				) : (
					<Flex
						w="full"
						py={6}
						justify="center"
						align="center"
						flexDir="column"
					>
						<Text as="h2" color="gray.400" fontSize="2xl" mb={4}>
							Your cart is empty!
						</Text>
						<Link href="/" passHref>
							<Button
								as="a"
								leftIcon={<IoCartOutline />}
								variant="ghost"
								size="lg"
							>
								Continue Shopping
							</Button>
						</Link>
					</Flex>
				)}
				{/* TODO wishlist section */}
			</VStack>
		</Layout>
	)
}

export default CartPage
