import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import { auth } from "@/firebase/clientApp";
import { Song } from "@/types";
import { Box, Center, CircularProgress, Divider } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

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

  const songs: Song[] = [];
  for (let i = 1; i <= 5; i++) {
    songs.push({
      id: i.toString(),
      name: `Song ${i}`,
      artists: [{ id: i.toString(), name: `Artist ${i}` }],
      genre: [`Genre ${i}`],
      album: `Album ${i}`,
      imageUrl: 'https://picsum.photos/42?random=' + i,
      duration: Math.floor(Math.random() * (300 - 120 + 1) + 120), // 120 - 300 seconds
      year: 2023,
    });
  }

  return (
    <Box w='100%'>
      <SearchBar />
      <Divider />
      <MusicList music={songs} />
    </Box>
  );
}

export default HomePage;
