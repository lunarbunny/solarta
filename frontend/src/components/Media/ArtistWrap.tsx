import { Box, Grid, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { Artist } from '../../types';
import ArtistCard from './ArtistCard';

type Props = {
  items: Artist[] | null;
};

const ArtistWrap: React.FC<Props> = ({ items: artists }) => {
  return (
    <SimpleGrid minChildWidth='100px' spacing={4}>
      {artists && artists.map((artist, index) => (
        <ArtistCard key={index} data={artist} />
      ))}
    </SimpleGrid>
  );
};

export default ArtistWrap;
