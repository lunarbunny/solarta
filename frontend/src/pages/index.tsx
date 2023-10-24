import AlbumWrap from "@/components/Media/AlbumWrap";
import ArtistWrap from "@/components/Media/ArtistWrap";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album, Artist, Music } from "@/types";
import { Box, Heading, Skeleton, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  const { data: musicTrending, loading: musicLoading } = useFetch<Music[]>(
    `${API_URL}/music/trending`
  );
  const { data: top3Artists, loading: artistLoading } = useFetch<Artist[]>(
    `${API_URL}/user/top3`
  );
  const { data: top3Albums, loading: albumLoading } = useFetch<Album[]>(
    `${API_URL}/album/top3`
  );
  return (
    <Box w="100%" p={8}>
      <Grid
        columnGap={16}
        templateAreas={`
          "search search"
          "trending artists"
          "trending albums"
          `}
        templateColumns={"1fr 1fr"}
        gridColumnGap={16}
      >
        <GridItem area={"search"} mb={8}>
          <SearchBar />
        </GridItem>

        <GridItem area={"trending"}>
          <Heading size="md">Trending today</Heading>
          <Box mt={4}>
            <Skeleton isLoaded={!musicLoading}>
              <MusicList items={musicTrending} />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={"artists"} mb={32}>
          <Heading size="md">Top Artists</Heading>
          <Box mt={4}>
            <Skeleton isLoaded={!artistLoading}>
              <ArtistWrap items={top3Artists} clickable />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={"albums"}>
          <Heading size="md">Top Albums</Heading>
          <Box mt={4}>
            <Skeleton isLoaded={!albumLoading}>
              <AlbumWrap items={top3Albums} clickable />
            </Skeleton>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default HomePage;
