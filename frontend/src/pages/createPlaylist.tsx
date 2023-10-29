import { API_URL, Music } from "@/types";
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
  Flex,
  Tooltip,
  Icon,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Button,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import SearchBar from "@/components/Search/SearchBar";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BiTime } from "react-icons/bi";
import { formatDate, durationToTime } from "../utils";

const CreatePlayListPage: NextPage = () => {
  const playlist: Music[] = [
    {
      id: 1,
      title: "Yo!",
      duration: 180,
      ownerName: "Xandr",
      albumName: "ICTSMC",
      genreId: 1,
      imageUrl: "https://picsum.photos/64?random=1",
    },
    {
      id: 2,
      title: "SoundHelix-Song-9",
      duration: 200,
      ownerName: "somebody",
      albumName: "Free Music",
      genreId: 1,
      imageUrl: "https://bit.ly/dan-abramov",
    },
    {
      id: 3,
      title: "SoundHelix-Song-2",
      duration: 140,
      ownerName: "anybody",
      albumName: "Free Music",
      genreId: 1,
      imageUrl: "https://bit.ly/dan-abramov",
    },
    {
      id: 4,
      title: "SoundHelix-Song-9",
      duration: 200,
      ownerName: "somebody",
      albumName: "Free Music",
      genreId: 1,
      imageUrl: "https://bit.ly/dan-abramov",
    },
    {
      id: 5,
      title: "Yo!",
      ownerName: "Xandr",
      albumName: "ICTSMC",
      duration: 180,
      genreId: 1,
      imageUrl: "https://picsum.photos/64?random=1",
    },
  ];
  const [playlistSongs, setPlayListSongs] = useState<Music[]>(playlist);
  const [playlistTitle, setPlaylistTitle] = useState("Playlist #4");
  const [playlistDesc, setPlaylistDesc] = useState(
    "A short description of the playlist can be written here!"
  );

  const bgColour = useColorModeValue("gray.600", "gray.700");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ownerID", "2");
    formData.append("creationDate", formatDate(new Date()));
    console.log(formatDate(new Date()));
    formData.append("title", playlistTitle);
    formData.append("description", playlistDesc);
    const response = await fetch(`${API_URL}/playlist/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.log(response);
    }
  };

  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return isEditing ? (
      <ButtonGroup my={9} mx="20px" size="sm" w="50%" spacing={2}>
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
    <form onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
      <Box h="25%">
        <Editable
          px={5}
          py={3}
          fontSize="50px"
          size="lg"
          defaultValue={playlistTitle}
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
            <Input size="lg" my={8} mx={2} as={EditableInput} />
            <Spacer />
            <EditableControls />
          </Flex>
        </Editable>

        <Editable
          px={5}
          py={3}
          fontSize="xl"
          size="lg"
          defaultValue={playlistDesc}
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
            <Input size="lg" my={8} mx={2} as={EditableInput} />
            <EditableControls />
          </Flex>
        </Editable>
      </Box>
      {/* Search bar*/}
      <Box display="flex" alignItems="center" h="10%" py={4} px={8}>
        <SearchBar />
      </Box>

      {/* Music list */}
      <Box
        h="55%"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "10px",
            borderRadius: "500px",
            backgroundColor: `rgba(65, 62, 63, 0.8)`,
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "500px",
            backgroundColor: `rgba(251, 154, 0, 0.8)`,
          },
        }}
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
            {playlistSongs &&
              playlistSongs.map((info, key) => (
                <Tr key={key} _hover={{ bg: "blue.700" }}>
                  <Td>{key + 1}</Td>
                  <Td>
                    <Flex direction="row">
                      <Image
                        boxSize="64px"
                        src={info ? info.imageUrl! : ""}
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
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      {/* Button */}
      <Flex h="10%" w="100%" align="center" justify="end" px={5}>
        <Button colorScheme="telegram" type="submit">
          Create playlist
        </Button>
      </Flex>
    </form>
  );
};

export default CreatePlayListPage;
