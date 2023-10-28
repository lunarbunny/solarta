import AlbumManagement from "@/components/Library/AlbumManagement";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album } from "@/types";
import { Box, Heading, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";

const LibraryPage: NextPage = () => {
  const { data: myAlbums } = useFetch<Album[]>(`${API_URL}/album/mine`, { includeCred: true });

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
