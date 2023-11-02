import AlbumManagement from "@/components/Library/AlbumManagement";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album } from "@/types";
import { Box, CircularProgress, Heading, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import router from "next/router";

const LibraryPage: NextPage = () => {
  const { user, loading: userLoading } = useAuth();
  const { data: myAlbums } = useFetch<Album[]>(`${API_URL}/album/mine`, { includeCred: true });

  if (userLoading) {
    return <CircularProgress isIndeterminate color="blue.300" />;
  } else if (!user || user.admin) {
    router.push("/"); // redirect to home page if not authorized
    return <>Redirecting to home page...</>;
  }

  return (
    <Box w='100%' p={8}>
      <Heading size='md' mb={4}>Library</Heading>

      <LibrarySection title="My Albums">
        <AlbumManagement albums={myAlbums || []} />
      </LibrarySection>

      <Spacer h={2} />

      <LibrarySection title="Upload music">
        <MusicUpload albums={myAlbums || []} />
      </LibrarySection>
    </Box>
  );
}

export default LibraryPage;
