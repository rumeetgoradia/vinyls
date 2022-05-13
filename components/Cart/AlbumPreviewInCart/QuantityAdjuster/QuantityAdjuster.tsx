import { Flex, IconButton, Input } from "@chakra-ui/react"
import { KeyboardEvent, useRef, useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"

type QuantityAdjusterProps = {
	quantity: number
	incrementQuantityOfAlbumInCart: () => void
	decrementQuantityOfAlbumInCart: () => void
	updateQuantityOfAlbumInCart: (quantity: number) => void
}

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({
	quantity: startingQuantity,
	incrementQuantityOfAlbumInCart,
	decrementQuantityOfAlbumInCart,
	updateQuantityOfAlbumInCart,
}) => {
	const [quantity, setQuantity] = useState<number>(startingQuantity)
	const [isFocused, setFocused] = useState<boolean>(false)

	const incrementQuantity = () => {
		setQuantity((prev) => {
			incrementQuantityOfAlbumInCart()
			return Math.min(99, prev + 1)
		})
	}

	const decrementQuantity = () => {
		setQuantity((prev) => {
			decrementQuantityOfAlbumInCart()
			return Math.max(0, prev - 1)
		})
	}

	const inputRef = useRef<HTMLInputElement>(null)

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" || event.key === "Escape") {
			inputRef.current?.blur()
			setFocused(false)
		}
	}

	return (
		<Flex>
			<IconButton
				onClick={decrementQuantity}
				disabled={quantity === 0}
				icon={<AiOutlineMinus />}
				aria-label="Decrease quantity"
				bg="white"
				borderRadius="0"
				size="xs"
				fontSize="xx-small"
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
					updateQuantityOfAlbumInCart(quantity)
				}}
				onKeyDown={handleKeyDown}
				min={0}
				max={99}
				size="sm"
				type="number"
				variant="outline"
				textAlign="center"
				w="42px"
				h="24px"
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
				size="xs"
				fontSize="xx-small"
				border="1px"
				borderLeft="none"
				borderColor={isFocused ? "black" : "gray.400"}
				_focus={{}}
				_active={{ bg: "gray.400" }}
			/>
		</Flex>
	)
}

export default QuantityAdjuster
