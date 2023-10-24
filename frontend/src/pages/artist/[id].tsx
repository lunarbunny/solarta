import AlbumCard from "@/components/Media/AlbumCard";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album, Artist } from "@/types";
import { Box, CircularProgress, Divider, Heading, Image, Skeleton, Text, Wrap } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

// Accessed via /artist/[id]
const ArtistDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: artist } = useFetch<Artist>(`${API_URL}/user/${router.query.id}`, true);
  const { data: artistAlbums } = useFetch<Album[]>(`${API_URL}/album/artist=${router.query.id}`, true);

  if (!artist) {
    return <CircularProgress isIndeterminate color='white.500' />;
  }

  return (
    <Box w='100%' maxW={'7xl'}>
      <Image
        alt={'artist cover'}
        src={`https://picsum.photos/720?random=${router.query.id}`}
        fit={'cover'}
        align={'center'}
        w={'100%'}
        h={{ base: '100%', sm: '400px' }}
      />

      <Box p={8}>
        <Box as={'header'}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
            {artist.name}
          </Heading>
          <Text
            color='gray.400'
            fontWeight={300}
            fontSize={'2xl'}>
            {artistAlbums ? `${artistAlbums.length} albums` : <Skeleton />}
          </Text>
        </Box>

        <Text>
          {artist.about}
        </Text>

        <Divider my={4} />

        <Wrap>
          {artistAlbums && artistAlbums.map((album, i) => (
            <Link href={`/album/${album.id}`} key={i}>
              <AlbumCard data={album} />
            </Link>
          ))}
        </Wrap>
      </Box>
    </Box>
  );
};

export default ArtistDetailPage;
