import Auth from "@/components/Auth/Auth";
import ArtistList from "@/components/Media/ArtistList";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const ArtistsPage: NextPage = () => {
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
    <Box w='100%' p={8}>
      <Heading size='md'>Explore All Talents</Heading>
      <ArtistList />
    </Box>
  )
}

export default ArtistsPage;
