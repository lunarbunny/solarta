import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import { auth } from "@/firebase/clientApp";
import useFetch from "@/hooks/useFetch";
import { API_URL, Music } from "@/types";
import { Box, Center, CircularProgress, Heading, Flex, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const { data: musicList } = useFetch<Music[]>(`${API_URL}/music`);

  if (loading) {
    return (
      <Center w="100%">
        <CircularProgress isIndeterminate color='blue.700' />
      </Center>
    )
  }

  if (!user) {
    return (
      <Auth />
    )
  }

  return (
    <Box w='100%' p={8}>
      <Box mb={8}>
        <SearchBar />
      </Box>

      <Heading size='md'>Trending today</Heading>
      <MusicList items={musicList} />

      <Spacer h={8} />

      <Heading size='md'>Listen again</Heading>
      <Flex direction='row' alignItems='center'>
        <MusicList items={musicList} />
      </Flex>
    </Box>
  );
}

export default HomePage;
