import { authAtom } from "@/atoms/auth";
import Auth from "@/components/Auth/Auth";
import AlbumList from "@/components/Media/AlbumList";
import { Box, Center, CircularProgress, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRecoilState } from "recoil";

const AlbumPage: NextPage = () => {
  const [auth] = useRecoilState(authAtom);

  if (!auth.accessToken) {
    return (
      <Auth />
    )
  }

  return (
    <Box w='100%' p={8}>
      <Heading size='md'>Explore All Talents</Heading>
      <AlbumList />
    </Box>
  );
}

export default AlbumPage;
