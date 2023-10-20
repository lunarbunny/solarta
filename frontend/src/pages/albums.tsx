import { authAtom } from "@/atoms/auth";
import Auth from "@/components/Auth/Auth";
import AlbumGrid from "@/components/Media/AlbumGrid";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL } from "@/types";
import { Box, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRecoilState } from "recoil";

const AlbumPage: NextPage = () => {
  const [auth] = useRecoilState(authAtom);
  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  if (!auth.accessToken) {
    return (
      <Auth />
    )
  }

  return (
    <Box w='100%' p={8}>
      <Heading size='md'>Explore All Talents</Heading>
      <AlbumGrid items={albums} />
    </Box>
  );
}

export default AlbumPage;
