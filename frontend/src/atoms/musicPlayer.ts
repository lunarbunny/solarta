import { API_URL, PlayerPlaylistItem } from '@/types';
import { atom } from 'recoil';

export interface MusicPlayerState {
  playlist: PlayerPlaylistItem[],
  currentTrack: number,
}

const defaultState: MusicPlayerState = {
  playlist: [],
  currentTrack: 0,
}

export const musicPlayerAtom = atom<MusicPlayerState>({
  key: 'musicPlayerAtom',
  default: defaultState,
});