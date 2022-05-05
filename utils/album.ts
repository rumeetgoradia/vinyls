import { AlbumFilterField, ALBUM_FILTERS } from "@constants"
import { Album } from "@prisma/client"
export const filterAlbums = (
	albums: Album[],
	filter?: string,
	filterField?: AlbumFilterField
): Album[] => {
	if (!filter || !filterField) {
		return []
	}

	const lowerCaseFilter = filter.toLowerCase()

	const filteredAlbums: Album[] = []
	for (const f of ALBUM_FILTERS[filterField]) {
		const filterResults = albums
			.filter((album) => f(album, lowerCaseFilter))
			.filter((album) =>
				filteredAlbums.every((filteredAlbum) => filteredAlbum.id !== album.id)
			)
		filteredAlbums.push(...filterResults)
	}

	return filteredAlbums
}
