import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { Album } from '../../types';

type Props = {
  data: Album;
};

function dateToYear(date: string): string {
  // Sun, 01 Jan 2023 00:00:00 GMT
  return date.split(' ')[3];
}

const AlbumItem: React.FC<Props> = ({ data }) => {
  return (
    <Flex
      alignItems="center"
      px={2} py={1}
      _hover={{ bg: 'blue.700' }}
    >
      <Image boxSize='42px' borderRadius='full'
        src={data.imageUrl || 'https://picsum.photos/42?random=' + data.id}
      />
      <Box
        flex={1}
        minW="200px"
        ml={3}>
        <Text fontWeight="semibold">
          {data.title && data.title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {data.description ? data.description : 'No description'}
        </Text>
      </Box>
      <Text fontSize="sm" me={2}>
        {data.releaseDate ? dateToYear(data.releaseDate) : 'No release date'}
      </Text>
    </Flex>
  );
};

export default AlbumItem;
