const API_URL = 'https://solarta.nisokkususu.com/api';
// const API_URL = 'http://localhost:5000';

type Music = {
    id: number;
    title: string;
    duration: number;
    ownerName: string; // Artist name
    genreId: number;
    imageUrl: string | null;
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
export type { Music, Album, Playlist, Artist, Genre, SearchRespose, PlayerPlaylistItem };