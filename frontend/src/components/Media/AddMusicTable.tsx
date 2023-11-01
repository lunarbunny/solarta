import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { Music } from "@/types";
import { BiTime } from "react-icons/bi";
import { durationToTime } from "../../utils";

type Props = {
  musicArray: Music[] | null;
  selectedSong: Array<{
    id: number;
    title: string;
  }>;
  setSelectedSong: React.Dispatch<
    React.SetStateAction<
      Array<{
        id: number;
        title: string;
      }>
    >
  >;
  setPlaylistSongs: React.Dispatch<React.SetStateAction<Array<number>>>;
};

const AddMusicTable: React.FC<Props> = ({
  musicArray: musicList,
  selectedSong,
  setSelectedSong,
  setPlaylistSongs,
}) => {
  const toast = useToast();

  function addSongToList() {
    toast({
      title: "Song added.",
      description: `We've added ${selectedSong[0].title} to the list!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setPlaylistSongs((current) => [...current, selectedSong[0].id]);
  }

  return (
    <Table size="md" colorScheme="facebook" variant="simple">
      <Thead>
        <Tr>
          <Th>#</Th>
          <Th>Title</Th>
          <Th>Album</Th>
          <Th>
            <Icon boxSize="20px" as={BiTime} />
          </Th>
          <Th isNumeric></Th>
        </Tr>
      </Thead>
      <Tbody>
        {musicList &&
          musicList.map((info, key) => (
            <Tr key={key} _hover={{ bg: "blue.700" }}>
              <Td>{key + 1}</Td>
              <Td>
                <Flex direction="row">
                  <Image
                    boxSize="64px"
                    src={"https://picsum.photos/42?random=" + info.id}
                    mr={2}
                    alt="cover"
                  />
                  <Flex justify="center" direction="column">
                    <Box>{info ? info.title : ""}</Box>
                    {info ? info.ownerName : ""}
                  </Flex>
                </Flex>
              </Td>
              <Td>{info ? info.albumName : ""}</Td>
              <Td>{durationToTime(info ? info.duration : 0)}</Td>
              <Td isNumeric>
                <Button
                  _hover={{ bg: "orange.600" }}
                  bg="blue.700"
                  color="whiteAlpha.900"
                  onClick={addSongToList}
                  onMouseOver={(e) =>
                    setSelectedSong([{ id: info.id, title: info.title }])
                  }
                >
                  ADD SONG
                </Button>
              </Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default AddMusicTable;
