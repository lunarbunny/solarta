import Auth from "@/components/Auth/Auth";
import MusicList from "@/components/Media/MusicList";

import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Flex, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const PlaylistPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

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
    <Box>
      <MusicList />
    </Box>
  );
};

export default PlaylistPage;
