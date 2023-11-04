import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Music, API_URL, Playlist } from "@/types";
import {
  Box,
  Flex,
  Link,
  Text,
  Icon,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsFillPlayFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FiInfo } from "react-icons/fi";
import MusicTable from "@/components/Media/MusicTable";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { PlayerPlaylistItem } from "../../types";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import AddMusicTable from "../../components/Media/AddMusicTable";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { deleteWithCsrfToken, postWithCsrfToken, putWithCsrfToken } from "@/utils";

const PlaylistPage: NextPage = () => {
  const router = useRouter();

  const { user, loading } = useAuth();
  const { data: playlist } = useFetch<Playlist>(
    `${API_URL}/playlist/${router.query.id}`,
    { usesRouter: true }
  );

  const { data: playlistMusic } = useFetch<Music[]>(
    `${API_URL}/playlist/${router.query.id}/music`,
    { usesRouter: true }
  );

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [playlistDate, setPlaylistDate] = useState("");

  const [editTitle, setEditTitle] = useState(playlistName);
  const [editDesc, setEditDesc] = useState(playlistDesc);

  const [selectedSong, setSelectedSong] = useState<
    Array<{
      id: number;
      title: string;
    }>
  >([]);

  const [playlistSongs, setPlayListSongs] = useState<Array<number>>([]);
  console.log(playlistSongs);
  const [addSongs, setAddSongs] = useState(false);
  const { data: notAddedMusic } = useFetch<Music[]>(`${API_URL}/playlist/${router.query.id}/music/notadded`, {
    usesRouter: true,
  });
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDelOpen,
    onOpen: onDelOpen,
    onClose: onDelClose,
  } = useDisclosure();

  const setMusicPlayer = useSetRecoilState(musicPlayerAtom);

  function handlePlayButton() {
    const allMusic: PlayerPlaylistItem[] = [];
    if (playlistMusic != null) {
      for (let i = 0; i < playlistMusic.length; i++) {
        let newItem: PlayerPlaylistItem = {
          id: playlistMusic[i].id,
          title: playlistMusic[i].title,
          artist: playlistMusic[i].ownerName || "Unknown artist",
          src: `${API_URL}/music/play/${playlistMusic[i].id}`,
          imageUrl: "https://picsum.photos/42?random=" + playlistMusic[i].id,
        };
        allMusic.push(newItem);
      }
      setMusicPlayer((prevState) => {
        return {
          ...prevState,
          playlist: allMusic,
          currentTrack: 0,
        };
      });
    }
  }

  const handleSavePlaylistDetails = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", playlistName);
    formData.append("description", playlistDesc);

    const response = await putWithCsrfToken(`${API_URL}/playlist/${router.query.id}/update`, null);

    if (response.ok) {
      location.reload();
    } else {
      console.log(response);
    }
  };

  const handlePlaylistDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await deleteWithCsrfToken(
      `${API_URL}/playlist/${router.query.id}/delete`, null);

    if (response.ok) {
      location.replace("/");
    } else {
      console.log(response);
    }
  };

  const handleAddMusicToPlaylist = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const playlistID: number = Number(router.query.id);

    for (let j = 0; j < playlistSongs.length; j++) {
      const response = await postWithCsrfToken(`${API_URL}/playlist/playlist=${playlistID}/music=${playlistSongs[j]}`, null);
      if (response.ok) {
      } else {
        console.log(response);
      }
    }
    location.reload();
  };

  function handleCancelAddSong() {
    setAddSongs(false);
    setPlayListSongs([]);
  }

  useEffect(() => {
    if (playlist != null) {
      setPlaylistName(playlist.title);
      setPlaylistDesc(playlist.description);
      setEditTitle(playlist.title);
      setEditDesc(playlist.description);
      const date = new Date(playlist.creationDate);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = date.getUTCDate().toString().padStart(2, "0");
      setPlaylistDate(`${year}-${month}-${day}`);
    }
  }, [playlist]);

  return (
    <Box color="whiteAlpha.800" bg="blackAlpha.700" w="100%" h="100%">
      {addSongs == false ? (
        <>
          <Box
            bgGradient="linear(to-t, blackAlpha.700, blue.900)"
            w="100%"
            h="30%"
          >
            <Box h="70%">
              <Text
                px={{ md: 5, lg: 8 }}
                fontSize={"75px"}
                onClick={onEditOpen}
                _hover={{ cursor: "pointer" }}
              >
                {editTitle}
              </Text>
              <Text
                fontSize="xl"
                px={10}
                onClick={onEditOpen}
                _hover={{ cursor: "pointer" }}
              >
                {editDesc}
              </Text>
            </Box>
            <Box h="30%">
              <Flex mt={3} mx={9} align="center">
                <Flex
                  borderRadius="3xl"
                  color="whiteAlpha.900"
                  bg="orange.500"
                  px={3.5}
                  py={1}
                  align="center"
                  justify="space-evenly"
                  _hover={{
                    bg: "orange.600",
                    color: "whiteAlpha.800",
                    cursor: "pointer",
                  }}
                  _active={{
                    transform: "scale(0.98)",
                  }}
                  onClick={handlePlayButton}
                >
                  <Icon boxSize="35px" as={BsFillPlayFill} />
                  <Text fontSize="lg">Play</Text>
                </Flex>
                <HStack
                  spacing="10px"
                  mx={3}
                  w="auto"
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                >
                  <Link fontSize="lg" href={"/account"}>
                    {user && user.name}
                  </Link>

                  <Text fontSize="lg" as="b">
                    .
                  </Text>
                  <Text fontSize="lg">
                    {playlistMusic ? playlistMusic.length : 0} songs
                  </Text>
                  <Text fontSize="lg" as="b">
                    .
                  </Text>
                  <Text fontSize="lg">Created {playlistDate}</Text>
                </HStack>
                <Menu>
                  <MenuButton as={Button}>
                    <Icon boxSize={5} as={BiDotsHorizontalRounded} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<AddIcon />}
                      onClick={(e) => setAddSongs(!addSongs)}
                    >
                      Add songs
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={onDelOpen}>
                      Delete playlist
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Box>
          </Box>
          <Box
            w="100%"
            h="68%"
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
            <MusicTable items={playlistMusic} />
          </Box>
        </>
      ) : (
        <form
          onSubmit={handleAddMusicToPlaylist}
          style={{ width: "100%", height: "100%" }}
        >
          <Box
            bgGradient="linear(to-t, blackAlpha.700, blue.900)"
            w="100%"
            h="25%"
          >
            <Box>
              <Text px={{ md: 5, lg: 8 }} fontSize={"75px"}>
                {editTitle}
              </Text>
              <Text fontSize="xl" px={10}>
                {editDesc}
              </Text>
            </Box>
          </Box>

          <Flex
            bgGradient="linear(to-t, blackAlpha.700, blackAlpha.900)"
            direction="row"
            alignItems="center"
            mx={3}
            h="10%"
            py={5}
          >
            <Icon boxSize={10} as={FiInfo} mr={2} />
            <Text fontSize="2xl">
              Choose songs below to add to your new playlist
            </Text>
          </Flex>

          <Box
            h="50%"
            bg="blackAlpha.900"
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
              musicArray={notAddedMusic}
              selectedSong={selectedSong}
              setSelectedSong={setSelectedSong}
              setPlaylistSongs={setPlayListSongs}
            />
          </Box>
          {/* Button */}
          <Flex
            bg="blackAlpha.900"
            h="15%"
            w="100%"
            align="center"
            justify="end"
            px={5}
          >
            <Button colorScheme="messenger" type="submit" mr={2}>
              Add to playlist
            </Button>
            <Button
              bg="red.400"
              _hover={{ bg: "red.500" }}
              onClick={handleCancelAddSong}
            >
              Cancel
            </Button>
          </Flex>
        </form>
      )}

      {/* EDIT TITLE & DESC MODAL*/}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <form onSubmit={handleSavePlaylistDetails}>
          <ModalContent>
            <ModalHeader>Edit Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Playlist Name</FormLabel>
                <Input
                  size="md"
                  width="auto"
                  placeholder={playlistName}
                  onChange={(newValue) =>
                    setPlaylistName(newValue.target.value)
                  }
                />
              </FormControl>

              <Spacer h={5} />
              <FormControl>
                <FormLabel>Playlist Description</FormLabel>
                <Textarea
                  placeholder={playlistDesc}
                  onChange={(newValue) =>
                    setPlaylistDesc(newValue.target.value)
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                onClick={onEditClose}
              >
                Save
              </Button>
              <Button variant="ghost" onClick={onEditClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* DELETE PLAYLIST */}
      <Modal isOpen={isDelOpen} onClose={onDelClose}>
        <ModalOverlay />
        <form onSubmit={handlePlaylistDelete}>
          <ModalContent>
            <ModalHeader>Delete Playlist</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete {playlistName} ?</Text>
            </ModalBody>

            <ModalFooter>
              <Button bg="red.500" mr={3} type="submit" onClick={onDelClose}>
                Yes
              </Button>
              <Button colorScheme="blue" onClick={onDelClose}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default PlaylistPage;
