import { API_URL } from "@/types";
import {
  Box,
  Center,
  CircularProgress,
  ButtonGroup,
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  useColorModeValue,
  Input,
  Textarea,
  Flex,
  Tooltip,
  Icon,
  Spacer,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Button,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BiTime } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

const CreatePlayListPage: NextPage = () => {
  type PlaylistItem = {
    src: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    cover: string;
  };

  const playlist: PlaylistItem[] = [
    {
      src: `${API_URL}/music/play/1`,
      title: "Yo!",
      artist: "Xandr",
      album: "ICTSMC",
      duration: 180,
      cover: "https://picsum.photos/64?random=1",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      album: "Free Music",
      duration: 200,
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "SoundHelix-Song-2",
      artist: "anybody",
      album: "Free Music",
      duration: 140,
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      album: "Free Music",
      duration: 200,
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: `${API_URL}/music/play/1`,
      title: "Yo!",
      artist: "Xandr",
      album: "ICTSMC",
      duration: 180,
      cover: "https://picsum.photos/64?random=1",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      album: "Free Music",
      duration: 200,
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: `${API_URL}/music/play/1`,
      title: "Yo!",
      artist: "Xandr",
      album: "ICTSMC",
      duration: 180,
      cover: "https://picsum.photos/64?random=1",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      album: "Free Music",
      duration: 200,
      cover: "https://bit.ly/dan-abramov",
    },
  ];
  const [playlistSongs, setPlayListSongs] = useState(playlist);
  const [playlistTitle, setPlaylistTitle] = useState("Rasengan ⚡️");
  const [playlistDesc, setPlaylistDesc] = useState(
    "A short description of the playlist can be written here!"
  );

  const bgColour = useColorModeValue("gray.600", "gray.700");

  function handleSubmit() {
    console.log("playlisttitle:" + playlistTitle);
    console.log("playlistdesc:" + playlistDesc);
  }

  function convertToMinutes(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const remainingSeconds = duration % 60;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    const formattedSeconds =
      remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString();

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return isEditing ? (
      <ButtonGroup my={8} mx="20px" size="sm" w="50%  " spacing={2}>
        <IconButton
          aria-label="confirm playlist title"
          icon={<CheckIcon />}
          colorScheme="blue"
          variant="solid"
          isRound={true}
          fontSize="13px"
          size="sm"
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="cancel playlist title"
          icon={<CloseIcon boxSize={3} />}
          colorScheme="red"
          variant="solid"
          isRound={true}
          fontSize="13px"
          size="sm"
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : null;
  }

  return (
    <Box
      // color="whiteAlpha.800"
      w="100%"
      h="100%"
      borderColor="pink.100"
      justifyContent="space-evenly"
      border="2px"
    >
      <Box my={5} mx={5} border="2px">
        <Editable
          px="5px"
          fontSize="50px"
          size="lg"
          defaultValue="Rasengan ⚡️"
          isPreviewFocusable={true}
          selectAllOnFocus={false}
          onChange={(newValue) => setPlaylistTitle(newValue)}
        >
          <Tooltip label="Click to edit">
            <EditablePreview
              px={4}
              _hover={{
                background: bgColour,
              }}
            />
          </Tooltip>
          <Flex direction="row">
            <Input my={8} px={4} as={EditableInput} />
            <Spacer />
            <EditableControls />
          </Flex>
        </Editable>

        <Editable
          px="5px"
          fontSize="xl"
          size="lg"
          defaultValue="A short description of the playlist can be written here!"
          isPreviewFocusable={true}
          selectAllOnFocus={false}
          onChange={(newValue) => setPlaylistDesc(newValue)}
        >
          <Tooltip label="Click to edit">
            <EditablePreview
              px={4}
              _hover={{
                background: bgColour,
              }}
            />
          </Tooltip>
          <Flex direction="row">
            <Input px={4} as={EditableInput} />
            <EditableControls />
          </Flex>
        </Editable>
      </Box>
      {/* Search bar*/}
      <Box
        border="2px"
        color="whiteAlpha.900"
        bg="purple.600"
        borderRadius="full"
        px={5}
        py={5}
        mx={7}
      >
        <SearchBar />
      </Box>

      {/* Music list */}
      <Box
        h="container.sm"
        // border="2px"
        // borderColor="red.500"
        overflowY="auto"
      >
        <Table size="md" colorScheme="facebook" variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Title</Th>
              <Th>Album</Th>
              <Th>
                <Icon boxSize="20px" as={BiTime} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {playlistSongs.map((info, key) => (
              <Tr key={key} _hover={{ bg: "blue.700" }}>
                <Td>{key + 1}</Td>
                <Td>
                  <Flex direction="row">
                    <Image boxSize="64px" src={info.cover} mr={2} alt="cover" />
                    <Flex justify="center" direction="column">
                      <Box>{info.title}</Box>
                      {info.artist}
                    </Flex>
                  </Flex>
                </Td>
                <Td>{info.album}</Td>
                <Td>{convertToMinutes(info.duration)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {/* Button */}
      <Flex w="100%" justify="end" px={5}>
        <Button alignItems="end" colorScheme="telegram" onClick={handleSubmit}>
          Save Playlist
        </Button>
      </Flex>
    </Box>
  );
};

export default CreatePlayListPage;
