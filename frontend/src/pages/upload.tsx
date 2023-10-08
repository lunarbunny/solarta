import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";
import MusicUpload from "@/components/Media/MusicUpload";
import { Song } from "@/components/Media/types";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center h="100%">
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
    <Box>
      <MusicUpload />
    </Box>
  );
}

export default HomePage;
