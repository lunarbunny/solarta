import { API_URL, Music } from "@/types";
import {
  Box,
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
  useToast,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { BiTime } from "react-icons/bi";
import { FiInfo } from "react-icons/fi";
import { formatDate, durationToTime } from "../utils";
import { useRouter } from "next/router";
import useFetch from "@/hooks/useFetch";
import AddMusicTable from "../components/Media/AddMusicTable";

const CreatePlayListPage: NextPage = () => {
  const router = useRouter();
  const toast = useToast();

  const [selectedSong, setSelectedSong] = useState<
    Array<{
      id: number;
      title: string;
    }>
  >([]);

  const { data: allMusic } = useFetch<Music[]>(`${API_URL}/music`, {
    usesRouter: true,
  });

  const [playlistSongs, setPlayListSongs] = useState<Array<number>>([]);
  const [playlistTitle, setPlaylistTitle] = useState("Playlist #4");
  const [playlistDesc, setPlaylistDesc] = useState(
    "Maximum 45 characters!"
  );

  const bgColour = useColorModeValue("gray.600", "gray.700");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("creationDate", formatDate(new Date()));
    formData.append("title", playlistTitle);
    formData.append("description", playlistDesc);

    const response = await fetch(`${API_URL}/playlist/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (response.ok) {
      router.push("/");
      // const { data: allPlaylist } = useFetch<Music[]>(
      //   `${API_URL}/playlist/mine`,
      //   {
      //     usesRouter: true,
      //   }
      // );
      // let playlistID = 0;
      // if (allPlaylist) {
      //   for (let i = 0; i < allPlaylist.length; i++) {
      //     if (allPlaylist[i].title == playlistTitle) {
      //       playlistID = allPlaylist[i].id;
      //     }
      //   }
      // }
      // for (let j = 0; j < setPlayListSongs.length; j++) {
      //   const response = await fetch(
      //     `${API_URL}/playlist=${playlistID}}/music=${playlistSongs[j]}`,
      //     {
      //       method: "POST",
      //       credentials: "include",
      //     }
      //   );
      //   if (response.ok) {
      //     console.log(`added ${selectedSong[0].title} to the playlist`);
      //   }
      // }
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
      <Flex direction="row" alignItems="center" mx={3} h="10%" py={5}>
        <Icon boxSize={10} as={FiInfo} mr={2} />
        <Text fontSize="2xl">
          Choose songs below to add to your new playlist
        </Text>
      </Flex>
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
        <AddMusicTable
          musicArray={allMusic}
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          setPlaylistSongs={setPlayListSongs}
        />
      </Box>
      {/* Button */}
      <Flex h="10%" w="100%" align="center" justify="end" px={5}>
        <Button colorScheme="messenger" type="submit">
          Create playlist
        </Button>
      </Flex>
    </form>
  );
};

export default CreatePlayListPage;
