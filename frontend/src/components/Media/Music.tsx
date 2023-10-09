import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Song } from '../../types';
import { FiHeart } from 'react-icons/fi';

type MusicProps = {
  song: Song;
};

function durationToTime(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

const Music: React.FC<MusicProps> = ({ song }) => {
  return (
    <Flex
      alignItems="center"
      px={2}
      py={1}
      _hover={{ bg: 'blue.700' }}
    >
      <Image boxSize='42px' borderRadius='full'
        src={song.imageUrl}
      />
      <Box
        flex={1}
        minW="200px"
        ml={3}>
        <Text fontWeight="semibold">
          {song.name}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {song.artists.map(a => a.name).join(', ')}
        </Text>
      </Box>
      <Text fontSize="sm" me={2}>
        {durationToTime(song.duration)}
      </Text>
      <FiHeart color="gray" />
    </Flex>
  );
};

export default Music;
