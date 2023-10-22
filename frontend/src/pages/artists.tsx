import ArtistWrap from "@/components/Media/ArtistWrap";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist } from "@/types";
import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";

const ArtistsPage: NextPage = () => {
  const { data: artists } = useFetch<Artist[]>(`${API_URL}/user`);

  return (
    <Box w='100%' p={8}>
      <Heading size='md' mb={4}>Our Talented Artists</Heading>
      <ArtistWrap items={artists} clickable />
    </Box>
  )
}

export default ArtistsPage;
