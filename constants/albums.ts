import { Album } from "@prisma/client"

export const ALBUM_FILTER_FIELDS = [
	"title",
	"artist",
	"year",
	"genre",
	"producer",
	"label",
] as const

export type AlbumFilterField = typeof ALBUM_FILTER_FIELDS[number]

export type AlbumFilters = {
	[K in AlbumFilterField]: ((album: Album, filter: string) => boolean)[]
}

export const ALBUM_FILTERS: AlbumFilters = {
	title: [
		(album, filter) => album.title.toLowerCase().startsWith(filter),
		(album, filter) => album.title.toLowerCase().includes(filter),
	],
	artist: [
		(album, filter) => album.artists[0].toLowerCase().startsWith(filter),
		(album, filter) => album.artists[0].toLowerCase().includes(filter),
		(album, filter) =>
			album.artists.some((artist) => artist.toLowerCase().startsWith(filter)),
		(album, filter) =>
			album.artists.some((artist) => artist.toLowerCase().includes(filter)),
	],
	genre: [
		(album, filter) =>
			album.genres.some((genre) => genre.toLowerCase().startsWith(filter)),
		(album, filter) =>
			album.genres.some((genre) => genre.toLowerCase().includes(filter)),
	],
	producer: [
		(album, filter) =>
			album.producers.some((producer) =>
				producer.toLowerCase().startsWith(filter)
			),
		(album, filter) =>
			album.producers.some((producer) =>
				producer.toLowerCase().includes(filter)
			),
	],
	label: [
		(album, filter) =>
			album.labels.some((label) => label.toLowerCase().startsWith(filter)),
		(album, filter) =>
			album.labels.some((label) => label.toLowerCase().includes(filter)),
	],
	year: [(album, filter) => album.year === parseInt(filter)],
}
