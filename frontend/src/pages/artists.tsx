import Auth from "@/components/Auth/Auth";
import ArtistGrid from "@/components/Media/ArtistGrid";
import { auth } from "@/firebase/clientApp";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist } from "@/types";
import { Box, Center, CircularProgress, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const ArtistsPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  const { data: artists, loading: artistLoading } = useFetch<Artist[]>(`${API_URL}/user`);

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

      {artistLoading && <ArtistGrid items={artists} />}
    </Box>
  )
}

export default ArtistsPage;
