import MusicList from "@/components/Media/MusicList";
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
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Spacer,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsFillPlayFill } from "react-icons/bs";

const PlaylistPage: NextPage = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO: Change this to fetch the playlist music instead
  const { data: playlistMusic } = useFetch<Music[]>(`${API_URL}/music`);

  function handlePlayPlaylist() {
    console.log("play all music in playlist");
    // TODO: Add all music in current playlist to queue and play from first song
  }

  // TODO:

  return (
    <Box color="whiteAlpha.800" bg="blackAlpha.700" w="100%" h="auto">
      <Box
        bgGradient="linear(to-t, blackAlpha.700, blue.900)"
        w="100%"
        h="30%"
        borderColor="red.100"
      >
        <Box>
          <Text
            px={8}
            fontSize="100px"
            onClick={onOpen}
            _hover={{ cursor: "pointer" }}
          >
            {"Rasengan ⚡️"}
          </Text>
          <Text
            fontSize="xl"
            px={10}
            onClick={onOpen}
            _hover={{ cursor: "pointer" }}
          >
            {"A short description of the playlist can be written here!"}
          </Text>
        </Box>

        <Flex mt={3} mx={9} align="center">
          <Flex
            borderRadius="3xl"
            // w="auto"
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
              onClick={handlePlayPlaylist}
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
      <Box w="100%" h="70%">
        <MusicList items={playlistMusic} />
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
                placeholder={"Rasengan ⚡️"}
                onChange={(newValue) => setPlaylistName(newValue.target.value)}
              />
            </FormControl>
            <Spacer h={5} />
            <FormControl>
              <FormLabel>Playlist Description</FormLabel>
              <Textarea
                placeholder={
                  "A short description of the playlist can be written here! "
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
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
