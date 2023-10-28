import ArtistWrap from "@/components/Media/ArtistWrap";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist } from "@/types";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Link,
  Flex,
} from "@chakra-ui/react";
import { NextPage } from "next";
import ArtistCard from "../components/Media/ArtistCard";

const ArtistsPage: NextPage = () => {
  const { data: artists } = useFetch<Artist[]>(`${API_URL}/user`);

  return (
    <Box w="100%" p={8} h="100%">
      <Heading size="md" mb={4}>
        Our Talented Artists
      </Heading>
      <ArtistWrap items={artists} clickable />
    </Box>
  );
};

export default ArtistsPage;
