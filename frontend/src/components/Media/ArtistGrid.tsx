import { Box, Grid } from '@chakra-ui/react';
import React from 'react';
import { Artist } from '../../types';
import ArtistItem from './ArtistItem';

type Props = {
  items: Artist[] | null;
};

const ArtistGrid: React.FC<Props> = ({ items: artists }) => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      {artists && artists.map((artist, index) => (
        <ArtistItem key={index} data={artist} />
      ))}
    </Grid>
  );
};

export default ArtistGrid;
