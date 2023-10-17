import { API_URL, PlayerPlaylistItem } from '@/types';
import { atom } from 'recoil';

export interface MusicPlayerState {
  playlist: PlayerPlaylistItem[],
  currentTrack: number,
}

const defaultState: MusicPlayerState = {
  playlist: [
    {
      src: `${API_URL}/music/play/1`,
      title: "Yo!",
      artist: "Xandr",
      imageUrl: "https://picsum.photos/64?random=1",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      imageUrl: "https://bit.ly/dan-abramov",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "SoundHelix-Song-2",
      artist: "anybody",
      imageUrl: "https://bit.ly/dan-abramov",
    },
  ],
  currentTrack: 0,
}

export const musicPlayerAtom = atom<MusicPlayerState>({
  key: 'musicPlayerAtom',
  default: defaultState,
});