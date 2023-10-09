import { Box, List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { Song } from '../../types';
import Music from './Music';

type Props = {
  music: Song[];
};

const MusicList: React.FC<Props> = ({ music: songs }) => {
  return (
    <Box>
      <List spacing={1}>
        {songs.map((song, index) => (
          <ListItem key={index}>
            <Music song={song} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MusicList;
