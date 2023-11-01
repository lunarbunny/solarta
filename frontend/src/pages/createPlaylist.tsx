import { API_URL } from "@/types";
import {
  Box,
  Input,
  Flex,
  Textarea,
  Button,
  Text,
  Tooltip,
  Icon,
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

  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");

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
      location.replace("/");
    } else {
      console.log(response);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
      <Flex
        direction="column"
        justify="center"
        alignItems="center"
        w="100%"
        h="100%"
        border="2px"
      >
        <Flex
          bg="blue.700"
          px={5}
          direction="column"
          justify="space-evenly"
          h="60%"
          w="40%"
          borderRadius="2xl"
        >
          <Flex alignItems="center" h="20%">
            <Text px={5} as="b" fontSize="3xl">
              Create Playlist
            </Text>
          </Flex>
          <Flex
            px={5}
            py={5}
            justify="space-around"
            w="100%"
            h="60%"
            direction="column"
          >
            <Box>
              <Flex align="center" direction="row">
                <Text mb={2} fontSize="xl">
                  Playlist Title:
                </Text>
                <Tooltip
                  label="Provide a title for your playlist with maximum 45 characters!"
                  aria-label="Playlist title tooltip"
                  shouldWrapChildren={true}
                >
                  <Icon mt={0.5} boxSize={5} as={FiInfo} ml={2} />
                </Tooltip>
              </Flex>
              <Input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPlaylistTitle(e.target.value)
                }
                size="md"
              />
            </Box>
            <Box>
              <Flex align="center" direction="row">
                <Text mb={2} fontSize="xl">
                  Playlist Description:
                </Text>
                <Tooltip
                  label="Provide a description for your playlist with maximum 45 characters!"
                  aria-label="Playlist description tooltip"
                  shouldWrapChildren={true}
                >
                  <Icon mt={0.5} boxSize={5} as={FiInfo} ml={2} />
                </Tooltip>
              </Flex>
              <Textarea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPlaylistDesc(e.target.value)
                }
                maxLength={45}
              />
            </Box>
          </Flex>
          <Flex h="20%" w="100%" align="center" justify="end" px={5}>
            <Button colorScheme="messenger" mr={2} type="submit">
              Create playlist
            </Button>
            <Button
              bg="red.400"
              _hover={{ bg: "red.500" }}
              onClick={(e) => router.push("/")}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
};

export default CreatePlayListPage;
