import { Box, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Album } from '../../types';
import { dateToYear } from '@/utils';

type Props = {
  data: Album;
};

const AlbumItem: React.FC<Props> = ({ data }) => {
  return (
    <Box maxW="330px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={data.imageUrl || 'https://picsum.photos/512?random=' + data.id} alt={data.title} />
      <Box p="5">
        <Text fontSize="xl" fontWeight="semibold">
          {data.title}
        </Text>
        <Text mt={2} color="gray.600">
          {dateToYear(data.releaseDate)}
        </Text>
      </Box>
    </Box>
  );
};

export default AlbumItem;
