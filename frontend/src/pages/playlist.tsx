import MusicList from "@/components/Media/MusicList";

import useFetch from "@/hooks/useFetch";
import { Music, API_URL } from "@/types";
import {
  Box,
  Flex,
  Link,
  Text,
  Icon,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { BsPlayCircleFill } from "react-icons/bs";

const PlaylistPage: NextPage = () => {

  // TODO: Change this to fetch the playlist music instead
  const { data: playlistMusic } = useFetch<Music[]>(`${API_URL}/music`);

  return (
    <Box
      color="whiteAlpha.800"
      mx={3}
      my={3}
      bg="blackAlpha.700"
      w="100%"
      h="auto"
      borderRadius="xl"
    >
      <Box
        borderRadius="xl"
        bgGradient="linear(to-t, blackAlpha.700, blue.900)"
        w="100%"
        h="30%"
        // border="2px"
        borderColor="red.100"
        mb={2}
      >
        <Text px={8} fontSize="100px">
          Rasengan
        </Text>
        <Flex mx={9}>
          <Icon
            mb={3}
            boxSize="60px"
            as={BsPlayCircleFill}
            color="orange.400"
            _hover={{ color: "orange.500" }}
          />
          <Flex
            mx={2}
            direction="row"
            w="20%"
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
          </Flex>
        </Flex>
      </Box>
      <Box w="100%" h="75%">
        <MusicList items={playlistMusic} />
      </Box>
    </Box>
  );
};

export default PlaylistPage;
