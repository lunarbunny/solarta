import useFetch from '@/hooks/useFetch';
import { Box, Grid, Heading } from '@chakra-ui/react';
import React from 'react';
import { API_URL, Album as AlbumList } from '../../types';
import AlbumItem from './AlbumItem';

const AlbumList: React.FC = () => {
  const { data: albums, loading, error } = useFetch<AlbumList[]>(`${API_URL}/album`);
  return (
    <Box>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {albums && albums.map((album, index) => (
          <AlbumItem key={index} data={album} />
        ))}
      </Grid>
    </Box>
  );
};

export default AlbumList;
