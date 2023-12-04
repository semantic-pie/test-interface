export interface Track {
  hash: string
  title: string
  author: string
  liked?: boolean
  genre: Genre
}

export interface Genre {
  idtf: string
  name: string
}