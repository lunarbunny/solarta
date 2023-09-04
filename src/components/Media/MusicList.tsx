import { Card, CardBody, CardHeader, Heading, List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { Song } from './types';
import Music from './Music';

type MusicListProps = {
  songs: Song[];
};

const MusicList: React.FC<MusicListProps> = ({ songs }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Music Library</Heading>
      </CardHeader>
      <CardBody>
        <List spacing={1}>
          {songs.map((song, index) => (
            <ListItem key={index}>
              <Music song={song} />
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
};

export default MusicList;
