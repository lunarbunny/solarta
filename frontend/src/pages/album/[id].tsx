import MusicList from "@/components/Media/MusicList";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL, Music } from "@/types";
import { dateToPretty, deleteWithCsrfToken } from "@/utils";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiUpload } from "react-icons/bi";

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

  let isOwner = user ? user.id == album.ownerId : false;
  let isAdmin = user ? user.admin : false;

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this album?")) {
      let res = await deleteWithCsrfToken(`${API_URL}/album/${album.id}/delete`, null);

      if (res.ok) {
        router.push("/library");
      } else {
        alert("Error: Could not delete album.");
      }
    }
  }

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
        <Box>
          <Heading
            lineHeight={1.1}
            fontWeight="semibold"
            fontSize={{ base: "4xl", lg: "5xl" }}
          >
            {album.title}
          </Heading>
          <Text color="gray.400" fontWeight={300} fontSize={"xl"}>
            By{" "}
            <u><Link href={`/artist/${album.ownerId}`}>{album.ownerName}</Link></u>{isOwner && " (You)"}
          </Text>
        </Box>

        <Text mt={4} color="gray.400">Released on <strong>{dateToPretty(album.releaseDate)}</strong>. {album.description}</Text>

        {(isOwner || isAdmin) && (
          <>
            <Divider my={4} />
            {isOwner && (
              <Link href={`/library?uploadToAlbum=${album.id}`}>
                <Button colorScheme="blue" size="sm"
                  leftIcon={<BiUpload />}>
                  Upload Music
                </Button>
              </Link>
            )}
            <Button colorScheme="red" size="sm" variant="outline" ml={4}
              leftIcon={<DeleteIcon />}
              onClick={handleDelete} >
              Delete Album
            </Button>
          </>
        )}

        <Divider my={4} />
        <MusicList items={albumMusic} editable={isOwner} />
      </Box>
    </Box>
  );
};

export default AlbumDetailPage;
