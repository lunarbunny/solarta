import Auth from "@/components/Auth/Auth";
import ArtistGrid from "@/components/Media/ArtistGrid";
import MusicList from "@/components/Media/MusicList";
import SearchBar from "@/components/Search/SearchBar";
import { auth } from "@/firebase/clientApp";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist, Music } from "@/types";
import { Box, Center, CircularProgress, Heading, Flex, Spacer, SkeletonCircle, Skeleton, Grid, GridItem } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const { data: musicList, loading: musicLoading } = useFetch<Music[]>(`${API_URL}/music`);
  const { data: artists, loading: artistLoading } = useFetch<Artist[]>(`${API_URL}/user`);

  if (loading) {
    return (
      <Center w='100%'>
        <CircularProgress isIndeterminate color='blue.700' />
      </Center>
    )
  }

  if (!user) {
    return (
      <Auth />
    )
  }

  console.log(musicList);
  console.log(artists);

  return (
    <Box w='100%' p={8}>
      <Grid h='100%'
        templateAreas={
          `
          "search search"
          "music music"
          "artist albums"
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
