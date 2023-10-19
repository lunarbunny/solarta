import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";

import { auth } from "@/firebase/clientApp";
import useFetch from "@/hooks/useFetch";
import { Music, API_URL } from "@/types";
import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Link,
  Text,
  Icon,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPlayCircleFill } from "react-icons/bs";

const PlaylistPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  // TODO: Change this to fetch the playlist music instead
  const { data: playlistMusic } = useFetch<Music[]>(`${API_URL}/music`);

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
