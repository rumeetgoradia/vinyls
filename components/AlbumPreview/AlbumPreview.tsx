import { CartContext } from "@cart"
import { Box, Button, Text } from "@chakra-ui/react"
import { Album } from "@prisma/client"
import { createTransition } from "@utils"
import Image from "next/image"
import { useRouter } from "next/router"
import { useContext } from "react"
import { IoCartOutline } from "react-icons/io5"
import { CartContextValues } from "../../cart/index"
type AlbumPreviewProps = {
	album: Album
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({ album }) => {
	const { id, coverArtBase64, coverArtUrl, title, artists, price } = album

	const { addAlbumToCart } = useContext<CartContextValues>(CartContext)

	const router = useRouter()

	const pushToAlbumPage = (id: string) => {
		router.push(`/albums/${id}`)
	}
	return (
		<Box
			role="group"
			cursor="pointer"
			_hover={{ transform: "scale(1.025)" }}
			transition={createTransition("transform")}
			onClick={() => {
				pushToAlbumPage(id)
			}}
		>
			<Box>
				<Box bg="black" position="relative" zIndex={1}>
					<Box
						transition={createTransition("opacity")}
						_groupHover={{ opacity: 0.5 }}
					>
						<Image
							layout="responsive"
							width={500}
							height={500}
							src={coverArtUrl}
							placeholder={coverArtBase64 ? "blur" : "empty"}
							blurDataURL={coverArtBase64 || ""}
							alt={title}
						/>
					</Box>
					<Button
						leftIcon={<IoCartOutline />}
						onClick={(e) => {
							e.stopPropagation()
							console.log("adding", album.title)
							addAlbumToCart(album, 1)
						}}
						title={`Add ${title} to Cart`}
						variant="ghost"
						size="sm"
						position="absolute"
						zIndex={2}
						left="50%"
						top="50%"
						transform="translate(-50%, -50%)"
						opacity={0}
						pointerEvents="none"
						_active={{
							transform: "translate(-50%, -50%) scale(0.975)",
						}}
						_groupHover={{
							opacity: 1,
							pointerEvents: "all",
						}}
						transition={createTransition([
							"opacity",
							"transform",
							"background",
						])}
					>
						Quick Add
					</Button>
				</Box>
				<Text fontWeight={500} lineHeight={1.15} my={1}>
					{title}
				</Text>
				<Text fontSize="sm" lineHeight={1.15} mb={1}>
					{artists.join(", ")}
				</Text>
				<Text fontSize="xs" lineHeight={1}>
					${price}
				</Text>
			</Box>
		</Box>
	)
}

export default AlbumPreview
