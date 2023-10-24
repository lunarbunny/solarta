// Use localhost for development, check env variable for production
const API_URL =
  process.env.NEXT_PUBLIC_SOLARTA_API_URL || "http://localhost:5000";

type Music = {
  id: number;
  title: string;
  duration: number;
  ownerName: string; // Artist name
  albumName: string;
  genreId: number;
  imageUrl: string | null;
};

type Album = {
  id: number;
  title: string;
  imageUrl: string;
  releaseDate: string;
  ownerId: number;
  ownerName: string; // Artist name
  description: string;

  size: number; // number of songs in the album
};

type Playlist = {
  name: string;
};

type Artist = {
  id: string;
  name: string;
  about: string;
};

type Genre = {
  id: number;
  name: string;
};

type SearchRespose = {
  pieces: Music[];
  artists: Artist[];
};

type PlayerPlaylistItem = {
  id: number;
  src: string;
  title: string;
  artist: string;
  imageUrl: string;
};

export { API_URL };
export type {
  Music,
  Album,
  Playlist,
  Artist,
  Genre,
  SearchRespose,
  PlayerPlaylistItem,
};
