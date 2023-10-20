import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Album } from '../../types';
import { dateToYear } from '@/utils';

type Props = {
  data: Album;
  onClick?: (album: Album) => void;
};

const AlbumCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <Flex direction='column' maxW='150px' borderWidth='1px' borderRadius='lg' overflow='hidden' onClick={(_) => onClick}>
      <Image src={data.imageUrl || 'https://picsum.photos/512?random=' + data.id} alt={data.title} />
      <Box p={4}>
        <Text fontSize='sm' fontWeight='semibold'>
          {data.title}
        </Text>
        <Text mt={2} color='gray.600'>
          {dateToYear(data.releaseDate)}
        </Text>
      </Box>
    </Flex>
  );
};

export default AlbumCard;
