import Auth from "@/components/Auth/Auth";
import { auth } from "@/firebase/clientApp";
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
import { useAuthState } from "react-firebase-hooks/auth";

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

  const [user, loading, error] = useAuthState(auth);
  const [playlistSongs, setPlayListSongs] = useState(playlist);

  const bgColour = useColorModeValue("gray.600", "gray.700");

  if (loading) {
    return (
      <Center w="100%">
        <CircularProgress isIndeterminate color="blue.700" />
      </Center>
    );
  }

  if (!user) {
    return <Auth />;
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
    <Flex color="whiteAlpha.800" w="100%" justify="center" h="auto">
      <Box my="15px" borderRadius="5px" bg="blackAlpha.700" w="70%" h="auto">
        <Box my={8}>
          <Editable
            px="5px"
            fontSize="50px"
            size="lg"
            defaultValue="Rasengan ⚡️"
            isPreviewFocusable={true}
            selectAllOnFocus={false}
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
              <Textarea my={2} px={4} as={EditableInput} />
              <EditableControls />
            </Flex>
          </Editable>
        </Box>
        <Box
          color="whiteAlpha.900"
          bg="purple.500"
          borderRadius="full"
          px={5}
          py={5}
          mx={4}
        >
          <SearchBar />
        </Box>

        <Box w="auto" my={5} h="450px" overflowY="auto">
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
                </Tr>
              </Thead>
              <Tbody>
                {playlistSongs.map((info, key) => (
                  <Tr key={key} _hover={{ bg: "blue.700" }}>
                    <Td>{key + 1}</Td>
                    <Td>
                      <Flex direction="row">
                        <Image
                          boxSize="64px"
                          src={info.cover}
                          mr={2}
                          alt="cover"
                        />
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
          </TableContainer>
        </Box>
        <Flex w="100%" justify="end" px={5}>
          <Button colorScheme="messenger">Save Playlist</Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default CreatePlayListPage;
