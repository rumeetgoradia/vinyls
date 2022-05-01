import { Album } from "@prisma/client"

export type AlbumWithPlaceholder = {
	base64: string
	album: Album
}
