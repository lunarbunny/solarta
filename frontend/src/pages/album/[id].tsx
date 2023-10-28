import MusicList from "@/components/Media/MusicList";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL, Music } from "@/types";
import {
  Box,
  CircularProgress,
  Divider,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

// Accessed via /album/[id]
const AlbumDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: album } = useFetch<Album>(
    `${API_URL}/album/${router.query.id}`,
    { usesRouter: true },
  );
  const { data: albumMusic } = useFetch<Music[]>(
    `${API_URL}/album/${router.query.id}/music`,
    { usesRouter: true },
  );

  const { user } = useAuth();

  if (!album) {
    return <CircularProgress isIndeterminate color="white.500" />;
  }

  let isOwner = user && user.id == album.ownerId;

  return (
    <Box w="100%" maxW={"7xl"}>
      <Image
        alt={"album cover"}
        src={`https://picsum.photos/720?random=${router.query.id}`}
        fit={"cover"}
        htmlWidth="100%"
        align={"center"}
        w={"100%"}
        h={{ base: "100%", sm: "400px" }}
      />

      <Box p={8}>
        <Box as={"header"}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
          >
            {album.title}
          </Heading>
          <Text color="gray.400" fontWeight={300} fontSize={"2xl"}>
            By{" "}
            {isOwner ? (
              "You"
            ) : (
              <u><Link href={`album/${album.id}`}>{album.ownerName}</Link></u>
            )}
          </Text>
        </Box>

        <Text>{album.description}</Text>

        <Divider my={4} />

        <MusicList items={albumMusic} />
      </Box>
    </Box>
  );
};

export default AlbumDetailPage;
