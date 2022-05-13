import { Box, Flex, IconButton, Spacer, Text } from "@chakra-ui/react"
import { DetailedAlbumInCart } from "@constants"
import { createTransition } from "@utils"
import Image from "next/image"
import Link from "next/link"
import { AiOutlinePlus } from "react-icons/ai"
import { QuantityAdjuster } from "./QuantityAdjuster"

type AlbumPreviewInCart = {
	album: DetailedAlbumInCart
	addAlbumToCart: (albumId: string, quantity?: number | undefined) => void
	removeAlbumFromCart: (albumId: string, quantity?: number | undefined) => void
	setQuantityOfAlbumInCart: (albumId: string, quantity: number) => void
}

const AlbumPreviewInCart: React.FC<AlbumPreviewInCart> = ({
	album: { coverArtBase64, coverArtUrl, title, artists, id, price, quantity },
	addAlbumToCart,
	removeAlbumFromCart,
	setQuantityOfAlbumInCart,
}) => {
	const incrementQuantityOfAlbumInCart = () => {
		addAlbumToCart(id, 1)
	}

	const decrementQuantityOfAlbumInCart = () => {
		removeAlbumFromCart(id, 1)
	}

	const updateQuantityOfAlbumInCart = (quantity: number) => {
		setQuantityOfAlbumInCart(id, quantity)
	}

	return (
		<Flex
			w="full"
			px={4}
			py={6}
			align="flex-start"
			borderBottom="1px"
			borderColor="gray.200"
		>
			<Link href={`/albums/${id}`} passHref>
				<Box as="a" minW="125px" w="125px" mr={6} title={title}>
					<Image
						width={500}
						height={500}
						src={coverArtUrl}
						placeholder={coverArtBase64 ? "blur" : "empty"}
						blurDataURL={coverArtBase64 || ""}
						alt={title}
					/>
				</Box>
			</Link>
			<Flex flexDir="column" h="125px" flexGrow={1} w="full">
				<Link href={`/albums/${id}`} passHref>
					<Box
						as="a"
						title={title}
						_hover={{ color: "brand.900" }}
						transition={createTransition("color")}
					>
						<Text as="span" fontSize="xl">
							{title}
						</Text>
						<Text>{artists.join(", ")}</Text>
					</Box>
				</Link>
				<Spacer />
				<Box>
					<Text fontStyle="italic" fontSize="sm">
						${price}
					</Text>
				</Box>
			</Flex>
			<Flex flexDir="column" justify="flex-end" h="125px">
				<Text fontSize="lg" fontWeight={600} textAlign="right">
					${(quantity * price).toFixed(2)}
				</Text>
				<Spacer />
				<Flex>
					<QuantityAdjuster
						quantity={quantity}
						incrementQuantityOfAlbumInCart={incrementQuantityOfAlbumInCart}
						decrementQuantityOfAlbumInCart={decrementQuantityOfAlbumInCart}
						updateQuantityOfAlbumInCart={updateQuantityOfAlbumInCart}
					/>
					<IconButton
						onClick={() => setQuantityOfAlbumInCart(id, 0)}
						icon={
							<Box transform="rotate(45deg)">
								<AiOutlinePlus />
							</Box>
						}
						aria-label={`Remove ${title} from cart`}
						title={`Remove ${title} from cart`}
						size="xs"
						ml={2}
						borderRadius="0"
						transition={createTransition("transform")}
						_active={{ transform: "scale(0.9)" }}
						_focus={{}}
					/>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default AlbumPreviewInCart
