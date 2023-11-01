import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { API_URL, Music, PlayerPlaylistItem } from "../../types";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { BiTime, BiTrash } from "react-icons/bi";
import MusicTableRow from "./MusicTableRow";

type Props = {
  items: Music[] | null;
};

const MusicTable: React.FC<Props> = ({ items }) => {
  const setMusicPlayer = useSetRecoilState(musicPlayerAtom);

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
    <TableContainer>
      <Table size="md" colorScheme="facebook" variant="simple">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Title</Th>
            <Th>Album</Th>
            <Th>
              <Icon boxSize="20px" as={BiTime} />
            </Th>
            <Th>
              <Icon boxSize="20px" as={BiTrash} />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {items &&
            items.map((song, index) => (
              <Tr
                key={index}
                borderRadius="2xl"
                _hover={{ bg: "blue.700", cursor: "pointer" }}
              >
                <MusicTableRow
                  index={index}
                  data={song}
                  onClick={handleClick}
                />
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default MusicTable;
