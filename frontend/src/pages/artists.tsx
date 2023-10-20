import { authAtom } from "@/atoms/auth";
import Auth from "@/components/Auth/Auth";
import ArtistWrap from "@/components/Media/ArtistGrid";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist } from "@/types";
import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRecoilState } from "recoil";

const ArtistsPage: NextPage = () => {
  const [auth] = useRecoilState(authAtom);
  const { data: artists } = useFetch<Artist[]>(`${API_URL}/user`);

  if (!auth.accessToken) {
    return (
      <Auth />
    )
  }

  return (
    <Box w='100%' p={8}>
      <Heading size='md'>Explore All Talents</Heading>

      <ArtistWrap items={artists} />
    </Box>
  )
}

export default ArtistsPage;
