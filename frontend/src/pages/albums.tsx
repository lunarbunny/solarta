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
      <Box py="20px" px="20px">
        <Grid templateColumns="repeat(4, 1fr)" gap={8}>
          {albums &&
            albums.map((album, index) => (
              <GridItem>
                <Link key={index} href={`/album/${album.id}`}>
                  <AlbumCard isPage={true} key={index} data={album} />
                </Link>
              </GridItem>
            ))}
        </Grid>
      </Box>
      {/* <AlbumWrap items={albums} clickable /> */}
    </Box>
  );
};

export default AlbumPage;
