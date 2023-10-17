import useFetch from '@/hooks/useFetch';
import { Box, Grid, Heading } from '@chakra-ui/react';
import React from 'react';
import { API_URL, Artist as ArtistList } from '../../types';
import ArtistItem from './ArtistItem';

const ArtistList: React.FC = () => {
  const { data: artists, loading, error } = useFetch<ArtistList[]>(`${API_URL}/user`);
  console.log(artists);
  return (
    <Box>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} paddingTop={10}>
        {artists && artists.map((artist, index) => (
          <ArtistItem key={index} data={artist} />
        ))}
      </Grid>
    </Box>
  );
};

export default ArtistList;
