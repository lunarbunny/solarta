import {
  Box,
  Flex,
  IconButton,
  List,
  ListItem,
} from "@chakra-ui/react";
import React from "react";
import { API_URL, Music, PlayerPlaylistItem } from "../../types";
import MusicItem from "./MusicItem";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { FiTrash } from "react-icons/fi";

type Props = {
  items: Music[] | null;
  editable?: boolean;
};

const MusicList: React.FC<Props> = ({ items, editable }) => {
  const setMusicPlayer = useSetRecoilState(musicPlayerAtom);

  if (items && items.length == 0) {
    return <Box>Music list is empty.</Box>;
  }

  const playMusic = (m: Music) => {
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

  const deleteMusic = async (m: Music) => {
    // Ask for confirmation
    if (!confirm(`Are you sure you want to delete "${m.title}"?`)) {
      return;
    }

    // DELETE /music/:id
    let res = await fetch(`${API_URL}/music/delete/${m.id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (res.ok) {
      // Remove the music from the playlist
      setMusicPlayer((prevState) => {
        const index = prevState.playlist.findIndex((i) => i.id == m.id);
        if (index != -1) {
          return {
            ...prevState,
            playlist: [
              ...prevState.playlist.slice(0, index),
              ...prevState.playlist.slice(index + 1),
            ],
          };
        } else {
          return prevState;
        }
      });
      window.location.reload();
    }
  }

  return (
    <Box>
      <List spacing={1}>
        {items &&
          items.map((music, index) => (
            <ListItem key={index}>
              <Flex w="100%" align="center">
                <Box flexGrow={1}>
                  <MusicItem data={music} onClick={playMusic} />
                </Box>
                {editable && (
                  <IconButton ml={2}
                    aria-label="Delete"
                    icon={<FiTrash />} color="red"
                    onClick={() => deleteMusic(music)}
                  />
                )}
              </Flex>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default MusicList;
