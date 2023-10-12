import { Box, List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { API_URL, Music } from '../../types';
import MusicItem from './MusicItem';
import useFetch from '@/hooks/useFetch';

const MusicList: React.FC = () => {
  const { data: musicList, loading, error } = useFetch<Music[]>(`${API_URL}/api/music`);

  return (
    <Box>
      <List spacing={1}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {musicList && musicList.map((song, index) => (
          <ListItem key={index}>
            <MusicItem data={song} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MusicList;
