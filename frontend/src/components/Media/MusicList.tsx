import {
  Box,
  List,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
} from "@chakra-ui/react";
import React, { useCallback } from "react";
import { API_URL, Music, PlayerPlaylistItem } from "../../types";
import MusicItem from "./MusicItem";
import useFetch from "@/hooks/useFetch";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { BiTime } from "react-icons/bi";

type Props = {
  items: Music[] | null;
};

const MusicList: React.FC<Props> = ({ items }) => {
  const setMusicPlayer = useSetRecoilState(musicPlayerAtom);

  if (items && items.length == 0) {
    return <Box>Music list is empty.</Box>;
  }

  const handleClick = (m: Music) => {
    setMusicPlayer((prevState) => {
      // If the music is already in the playlist, don't add it again.
      // Instead, move it to the top of the playlist.
      const index = prevState.playlist.findIndex((i) => i.id == m.id);
      if (index != -1) {
        return {
          ...prevState,
          playlist: [
            prevState.playlist[index],
            ...prevState.playlist.slice(0, index),
            ...prevState.playlist.slice(index + 1),
          ],
          currentTrack: index,
        };
      } else {
        let newItem: PlayerPlaylistItem = {
          id: m.id,
          title: m.title,
          artist: m.ownerName || "Unknown artist",
          src: `${API_URL}/music/play/${m.id}`,
          imageUrl: m.imageUrl || "https://picsum.photos/42?random=" + m.id,
        };
        return {
          ...prevState,
          playlist: [newItem, ...prevState.playlist],
          currentTrack: 0,
        };
      }
    });
  };

  return (
    <Box>
      <List spacing={1}>
        {items &&
          items.map((song, index) => (
            <ListItem key={index}>
              <MusicItem index={index} data={song} onClick={handleClick} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default MusicList;
