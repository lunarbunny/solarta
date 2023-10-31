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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsFillPlayFill } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import MusicTable from "@/components/Media/MusicTable";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { PlayerPlaylistItem } from "../../types";
import { useRouter } from "next/router";

const PlaylistPage: NextPage = () => {
  const router = useRouter();

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

  const { isOpen, onOpen, onClose } = useDisclosure();

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

    const response = await fetch(
      `${API_URL}/playlist/${router.query.id}/update`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (response.ok) {
      location.reload();
    } else {
      console.log(response);
    }
  };

  const handlePlaylistDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hi");
    const response = await fetch(
      `${API_URL}/playlist/${router.query.id}/delete`
    );

    if (response.ok) {
      router.push("http://localhost:3000/");
    } else {
      console.log(response);
    }
  };

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
      <Box bgGradient="linear(to-t, blackAlpha.700, blue.900)" w="100%" h="30%">
        <Box h="70%">
          <Text
            px={{ md: 5, lg: 8 }}
            fontSize={"75px"}
            onClick={onOpen}
            _hover={{ cursor: "pointer" }}
          >
            {editTitle}
          </Text>
          <Text
            fontSize="xl"
            px={10}
            onClick={onOpen}
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
            >
              <Icon
                boxSize="35px"
                as={BsFillPlayFill}
                onClick={handlePlayButton}
              />
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
              <Link fontSize="lg">Username</Link>

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
            <Popover>
              <PopoverTrigger>
                <span>
                  <Icon
                    boxSize="35px"
                    _hover={{
                      transform: "scale(1.05)",
                      color: "whiteAlpha.900",
                      cursor: "pointer",
                    }}
                    _active={{
                      transform: "scale(0.98)",
                    }}
                    as={BiDotsHorizontalRounded}
                  />
                </span>
              </PopoverTrigger>
              <PopoverContent w="100%">
                <PopoverBody p={0}>
                  <Box
                    px={0}
                    my={3}
                    _hover={{ bg: "whiteAlpha.300", cursor: "pointer" }}
                    onClick={(e) => handlePlaylistDelete}
                  >
                    <Text px={2}>Delete playlist</Text>
                  </Box>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
      <Modal isOpen={isOpen} onClose={onClose}>
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
              <Button colorScheme="blue" mr={3} type="submit" onClick={onClose}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default PlaylistPage;
