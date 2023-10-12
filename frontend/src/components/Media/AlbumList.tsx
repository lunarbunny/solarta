import useFetch from '@/hooks/useFetch';
import { Box, List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { API_URL, Album as AlbumList } from '../../types';
import AlbumItem from './AlbumItem';

const AlbumList: React.FC = () => {
  const { data: albums, loading, error } = useFetch<AlbumList[]>(`${API_URL}/api/album`);

  return (
    <Box>
      <List spacing={1}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {albums && albums.map((album, index) => (
          <ListItem key={index}>
            <AlbumItem data={album} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AlbumList;
