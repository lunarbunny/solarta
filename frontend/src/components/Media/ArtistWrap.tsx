import { Box, Grid, SimpleGrid, Wrap } from '@chakra-ui/react';
import React from 'react';
import { Artist } from '../../types';
import ArtistCard from './ArtistCard';
import Link from 'next/link';

type Props = {
  items: Artist[] | null;
  clickable?: boolean;
};

const ArtistWrap: React.FC<Props> = ({ items: artists, clickable }) => {
  return (
    <Wrap spacing={4}>
      {artists && artists.map((artist, index) => (
        clickable ? (
          <Link key={index} href={`/artist/${artist.id}`}>
            <ArtistCard key={index} data={artist} />
          </Link>
        ) : (
          <Box key={index}>
            <ArtistCard key={index} data={artist} />
          </Box>
        )
      ))}
    </Wrap>
  );
};

export default ArtistWrap;
