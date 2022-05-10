import { CartContext, CartContextValues } from "@cart"
import { Box } from "@chakra-ui/react"
import { Layout } from "@components/Layout"
import { NextPage } from "next"
import { useContext } from "react"
const CartPage: NextPage = () => {
	const { cart } = useContext<CartContextValues>(CartContext)

	return (
		<Layout title="Cart">
			{cart.map((albumInCart) => (
				<Box>
					{albumInCart.albumId} -- {albumInCart.quantity}
				</Box>
			))}
		</Layout>
	)
}

export default CartPage
