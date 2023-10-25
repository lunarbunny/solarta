import AlbumWrap from "@/components/Media/AlbumWrap";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL } from "@/types";
import { Box, Heading, Grid, GridItem, Link } from "@chakra-ui/react";
import { NextPage } from "next";
import AlbumCard from "../components/Media/AlbumCard";

const AlbumPage: NextPage = () => {
  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  return (
    <Box w="100%" p={8}>
      <Heading size="md" mb={4}>
        Released Albums
      </Heading>
      <AlbumWrap items={albums} clickable />
    </Box>
  );
};

export default AlbumPage;
