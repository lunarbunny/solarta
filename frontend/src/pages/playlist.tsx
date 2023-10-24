import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Music, API_URL } from "@/types";
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
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsFillPlayFill } from "react-icons/bs";
import MusicTable from "@/components/Media/MusicTable";
import { useSetRecoilState } from "recoil";
import { musicPlayerAtom } from "@/atoms/musicPlayer";
import { PlayerPlaylistItem } from "../types";

const PlaylistPage: NextPage = () => {
  const [playlistName, setPlaylistName] = useState("rasengan");
  const [playlistDesc, setPlaylistDesc] = useState("abc");

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: fetch the id of the playlist the user selected and set it to playlist_id

  const { data: playlistMusic } = useFetch<Music[]>(`${API_URL}/music`);

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

  const handleSavePlaylistDetails = () => {
    let newTitle = editTitle;
    let newDesc = editDesc;

    //TODO: call API to post new title and desc to db

    if (newTitle != "") {
      setPlaylistName(newTitle);
    }
    if (newDesc != "") {
      setPlaylistDesc(newDesc);
    }
    onClose();
  };

  return (
    <Box color="whiteAlpha.800" bg="blackAlpha.700" w="100%" h="100%">
      <Box
        bgGradient="linear(to-t, blackAlpha.700, blue.900)"
        w="100%"
        h="30%"
        // border="2px"
        // borderColor="red.100"
      >
        <Box h="70%">
          <Text
            px={{ md: 5, lg: 8 }}
            fontSize={{ sm: "50px", md: "75px", lg: "100px" }}
            onClick={onOpen}
            _hover={{ cursor: "pointer" }}
          >
            {playlistName}
          </Text>
          <Text
            fontSize="xl"
            px={10}
            onClick={onOpen}
            _hover={{ cursor: "pointer" }}
          >
            {playlistDesc}
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
              <Text fontSize="lg">15 songs</Text>
              <Text fontSize="lg" as="b">
                .
              </Text>
              <Text fontSize="lg">50 min 20 sec</Text>
            </HStack>
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
                onChange={(newValue) => setEditTitle(newValue.target.value)}
              />
            </FormControl>
            <Spacer h={5} />
            <FormControl>
              <FormLabel>Playlist Description</FormLabel>
              <Textarea
                placeholder={playlistDesc}
                onChange={(newValue) => setEditDesc(newValue.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSavePlaylistDetails}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlaylistPage;
