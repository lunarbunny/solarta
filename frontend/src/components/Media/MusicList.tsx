import { Box, List, ListItem } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { API_URL, Music, PlayerPlaylistItem } from '../../types';
import MusicItem from './MusicItem';
import useFetch from '@/hooks/useFetch';
import { useSetRecoilState } from 'recoil';
import { musicPlayerAtom } from '@/atoms/musicPlayer';

const MusicList: React.FC = () => {
  const { data: musicList, loading, error } = useFetch<Music[]>(`${API_URL}/music`);

  const setMusicPlayer = useSetRecoilState(musicPlayerAtom);

  const handleClick = (m: Music) => {
    let playlistItem: PlayerPlaylistItem = {
      title: m.title,
      artist: m.ownerName || 'Unknown artist',
      src: `${API_URL}/music/play/${m.id}`,
      imageUrl: m.imageUrl || 'https://picsum.photos/42?random=' + m.id,
    };
    setMusicPlayer(
      (prevState) => ({
        ...prevState,
        playlist: [playlistItem, ...prevState.playlist],
        currentTrack: 0,
      }),
    );
  };

  return (
    <Box>
      <List spacing={1}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {musicList && musicList.map((song, index) => (
          <ListItem key={index}>
            <MusicItem data={song} onClick={handleClick} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MusicList;
