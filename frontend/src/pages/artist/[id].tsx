import ArtistCard from "@/components/Media/ArtistCard";
import MusicList from "@/components/Media/MusicList";
import useFetch from "@/hooks/useFetch";
import { API_URL, Artist, Music } from "@/types";
import { CircularProgress, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

// Accessed via /artist/[id]
const ArtistDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: artist } = useFetch<Artist>(`${API_URL}/user/${router.query.id}`, true);
  const { data: artistMusic } = useFetch<Music[]>(`${API_URL}/album/artist=${router.query.id}`, true);

  if (!artist) {
    return <CircularProgress isIndeterminate color='white.500' />;
  }

  return (
    <Flex direction='row'>
      <ArtistCard data={artist} />
      <MusicList items={artistMusic} />
    </Flex>
  );
};

export default ArtistDetailPage;
