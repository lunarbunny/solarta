import Auth from "@/components/Auth/Auth";
import AlbumList from "@/components/Media/AlbumList";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const AlbumPage: NextPage = () => {
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

  return (
    <Box w='100%'>
      <AlbumList />
    </Box>
  );
}

export default AlbumPage;
