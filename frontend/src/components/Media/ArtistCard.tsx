import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Artist } from '../../types';

type Props = {
  data: Artist;
};

const ArtistCard: React.FC<Props> = ({ data }) => {
  return (
    <Box textAlign='center' maxW='100px'>
      <Image alt='artist image' borderRadius='full'
        src={'https://picsum.photos/512?random=' + data.id}
      />
      <Box paddingTop={3}>
        <Text fontSize='sm' fontWeight='bold' noOfLines={1}>
          {data.name}
        </Text>
      </Box>
    </Box>
  );
};

export default ArtistCard;
