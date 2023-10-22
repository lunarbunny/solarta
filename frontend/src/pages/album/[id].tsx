import AlbumCard from "@/components/Media/AlbumCard";
import MusicList from "@/components/Media/MusicList";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL, Music } from "@/types";
import { CircularProgress, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

// Accessed via /album/[id]
const AlbumDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: album } = useFetch<Album>(`${API_URL}/album/${router.query.id}`, true);
  const { data: albumMusic } = useFetch<Music[]>(`${API_URL}/album/${router.query.id}/music`, true);

  if (!album) {
    return <CircularProgress isIndeterminate color='white.500' />;
  }

  return (
    <Flex direction='row'>
      <AlbumCard data={album} />
      <MusicList items={albumMusic} />
    </Flex>
  );
};

export default AlbumDetailPage;
