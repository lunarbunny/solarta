import ArtistGrid from "@/components/Media/ArtistGrid";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist, Music } from "@/types";
import { Box, Heading, Skeleton, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  const { data: musicList, loading: musicLoading } = useFetch<Music[]>(`${API_URL}/music`);
  const { data: artists, loading: artistLoading } = useFetch<Artist[]>(`${API_URL}/user`);

  return (
    <Box w='100%' p={8}>
      <Grid h='100%'
        templateAreas={
          `
          "search search"
          "music albums"
          "music artist"
          `
        }
        templateColumns={'repeat(2, 1fr)'}
        gap={4}
      >
        <GridItem area={'search'}>
          <SearchBar />
        </GridItem>

        <GridItem area={'music'}>
          <Heading size='md'>Trending today</Heading>
          <Box flexGrow={4}>
            <Skeleton isLoaded={!musicLoading}>
              <MusicList items={musicList} />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={'artist'}>
          <Box flexGrow={4}>
            <Skeleton isLoaded={!artistLoading}>
              <ArtistGrid items={artists} />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={'albums'}>
          <Box flexGrow={4}>
            <Skeleton isLoaded={!artistLoading}>
              <ArtistGrid items={artists} />
            </Skeleton>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default HomePage;
