type Song = {
    id: string;
    name: string;
    artists: Artist[];
    genre: string[];
    album: string;
    year: number;
    duration: number;
    imageUrl: string;
};

type Playlist = {
    name: string;
};

type Artist = {
    id: string;
    name: string;
};

type SearchRespose = {
    songs: Song[];
    artists: Artist[];
};

export type { Song, Playlist, Artist, SearchRespose };