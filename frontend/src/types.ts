const API_URL = 'https://solarta.nisokkususu.com/api';

type Music = {
    id: number;
    title: string;
    filename: string;
    duration: number;
    genreId: number;
    imageUrl: string;

    albums: Album[] | null;
    artists: Artist[] | null;
};

type Album = {
    id: number;
    title: string;
    imageUrl: string;
    releaseDate: string;
    ownerId: number;
    description: string;

    size: number; // number of songs in the album
};

type Playlist = {
    name: string;
};

type Artist = {
    id: string;
    name: string;
};

type SearchRespose = {
    pieces: Music[];
    artists: Artist[];
};

export { API_URL };
export type { Music, Album, Playlist, Artist, SearchRespose };