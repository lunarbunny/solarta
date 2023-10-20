import AlbumGrid from "@/components/Media/AlbumWrap";
import ArtistWrap from "@/components/Media/ArtistWrap";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album, Artist, Music } from "@/types";
import { Box, Heading, Skeleton, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  const { data: musicList, loading: musicLoading } = useFetch<Music[]>(`${API_URL}/music`);
  const { data: artists, loading: artistLoading } = useFetch<Artist[]>(`${API_URL}/user`);
  const { data: albums, loading: albumLoading } = useFetch<Album[]>(`${API_URL}/album`);
  return (
    <Box w='100%' p={8}>
      <Grid columnGap={16}
        templateAreas={
          `
          "search search"
          "trending artists"
          "trending albums"
          `
        }
        templateColumns={'repeat(2, 1fr)'}
        gridColumnGap={16}
      >
        <GridItem area={'search'} mb={8}>
          <SearchBar />
        </GridItem>

        <GridItem area={'trending'}>
          <Heading size='md'>Trending today</Heading>
          <Box flexGrow={4} mt={4}>
            <Skeleton isLoaded={!musicLoading}>
              <MusicList items={musicList} />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={'artists'} mb={32}>
          <Heading size='md'>Top Artists</Heading>
          <Box flexGrow={4} mt={4}>
            <Skeleton isLoaded={!artistLoading}>
              <ArtistWrap items={artists} />
            </Skeleton>
          </Box>
        </GridItem>

        <GridItem area={'albums'}>
          <Heading size='md'>Top Albums</Heading>
          <Box flexGrow={4} mt={4}>
            <Skeleton isLoaded={!albumLoading}>
              <AlbumGrid items={albums} clickable />
            </Skeleton>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default HomePage;
