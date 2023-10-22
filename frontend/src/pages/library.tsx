import { authAtom } from "@/atoms/auth";
import AlbumManagement from "@/components/Library/AlbumManagement";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import AlbumWrap from "@/components/Media/AlbumWrap";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album } from "@/types";
import { Box, Button, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import { useState } from "react";
import { useRecoilState } from "recoil";

const LibraryPage: NextPage = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  // if (!auth.accessToken) {
  //   return (
  //     <Box w='100%' p={8}>
  //       <Auth />
  //     </Box>
  //   )
  // }

  return (
    <Box w='100%' p={8}>
      <Heading size='md' mb={4}>Library</Heading>

      <LibrarySection title="My Albums">
        <AlbumManagement albums={albums || []} />
      </LibrarySection>

      <Spacer h={2} />

      <LibrarySection title="Upload music">
        <MusicUpload albums={albums || []} />
      </LibrarySection>
    </Box>
  );
}

export default LibraryPage;
