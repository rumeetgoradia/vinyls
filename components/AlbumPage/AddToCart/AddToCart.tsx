import { Box, Button, Flex, IconButton, Input } from "@chakra-ui/react"
import { KeyboardEvent, useRef, useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

type AddToCartProps = {
	addToCart: (quantity: number) => void
}

const AddToCart: React.FC<AddToCartProps> = ({ addToCart }) => {
	const [quantity, setQuantity] = useState<number>(1)
	const [isFocused, setFocused] = useState<boolean>(false)

	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1)
	}

	const decrementQuantity = () => {
		setQuantity((prev) => prev - 1)
	}

	const inputRef = useRef<HTMLInputElement>(null)

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" || event.key === "Escape") {
			inputRef.current?.blur()
			setFocused(false)

			if (event.key === "Enter") {
				pushAddToCart()
			}
		}
	}

	const pushAddToCart = () => {
		addToCart(quantity)
	}

	return (
		<Box>
			<Flex>
				<IconButton
					onClick={decrementQuantity}
					disabled={quantity === 0}
					icon={<AiOutlineMinus />}
					aria-label="Decrease quantity"
					bg="white"
					borderRadius="0"
					size="sm"
					border="1px"
					borderColor={isFocused ? "black" : "gray.400"}
					borderRight="none"
					_focus={{}}
					_active={{ bg: "gray.400" }}
				/>
				<Input
					value={quantity}
					ref={inputRef}
					onChange={(e) => {
						setQuantity(parseInt(e.target.value))
					}}
					onFocus={() => {
						setFocused(true)
					}}
					onBlur={() => {
						setFocused(false)
					}}
					onKeyDown={handleKeyDown}
					min={0}
					max={99}
					size="sm"
					type="number"
					variant="outline"
					textAlign="center"
					w="56px"
					h="32px"
					borderColor="gray.400"
					bg="white"
					_hover={{}}
					_focus={{
						borderColor: "black",
					}}
				/>
				<IconButton
					onClick={incrementQuantity}
					disabled={quantity === 99}
					icon={<AiOutlinePlus />}
					aria-label="Increase quantity"
					bg="white"
					borderRadius="0"
					size="sm"
					border="1px"
					borderLeft="none"
					borderColor={isFocused ? "black" : "gray.400"}
					_focus={{}}
					_active={{ bg: "gray.400" }}
				/>
			</Flex>
			<Button variant="ghost" size="sm" mt={0}>
				Add To Cart
			</Button>
		</Box>
	)
}

export default AddToCart
