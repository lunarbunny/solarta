type Song = {
    name: string;
    artist: string[];
    genre: string[];
    album: string;
    year: number;
    duration: number;
    image: string;
};

type Playlist = {
    name: string;
};

export type { Song, Playlist };