import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";
import MusicUpload from "@/components/Media/MusicUpload";
import { Song } from "@/components/Media/types";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Container, HStack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center height="90vh">
        <CircularProgress isIndeterminate color='blue.700' />
      </Center>
    )
  }

  if (!user) {
    return (
      <>
        <Auth />
      </>
    )
  }

  const songs: Song[] = [];
  for (let i = 1; i <= 5; i++) {
    songs.push({
      name: `Song ${i}`,
      artist: [`Artist ${i}`],
      genre: [`Genre ${i}`],
      album: `Album ${i}`,
      image: 'https://fakeimg.pl/64x64',
      duration: 180,
      year: 0
    });
  }

  return (
    <Container maxW="container.lg" centerContent padding="16px" >
      <Box mb={2}>
        <Text>Logged in, this is the home page.</Text>
      </Box>

      <HStack spacing={4} align="stretch">
        <MusicList songs={songs} />
        <MusicUpload />
      </HStack>
    </Container>
  )
}

export default Home;
