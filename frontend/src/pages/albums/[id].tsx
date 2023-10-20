import AlbumCard from "@/components/Media/AlbumCard";
import MusicItem from "@/components/Media/MusicItem";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL, Music } from "@/types";
import { CircularProgress, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";

// Accessed via /albums/[id]
const AlbumDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: album } = useFetch<Album>(`${API_URL}/album/${router.query.id}`);
  const { data: musicList } = useFetch<Music[]>(`${API_URL}/album/${router.query.id}/music`);

  if (!album) {
    return <CircularProgress isIndeterminate color='white.500' />;
  }

  return (
    <Flex direction='row'>
      <AlbumCard data={album} />

      <Flex direction='column' ml={8}>
        {musicList && musicList.map((music, index) => (
          <MusicItem key={index} data={music} />
        ))}
      </Flex>
    </Flex>
  );
};

export default AlbumDetailPage;
