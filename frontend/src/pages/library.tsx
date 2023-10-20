import { authAtom } from "@/atoms/auth";
import Auth from "@/components/Auth/Auth";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import AlbumList from "@/components/Media/AlbumList";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album } from "@/types";
import { Box, Button, Center, CircularProgress, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useDisclosure } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRecoilState } from "recoil";

const LibraryPage: NextPage = () => {
  const [auth, setAuth] = useRecoilState(authAtom);

  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  const handleCreateAlbum = () => {
    console.log('create album');

  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!auth.accessToken) {
    return (
      <Box w='100%' p={8}>
        <Auth />
      </Box>
    )
  }

  return (
    <>
      <Box w='100%' p={8}>
        <Heading size='md'>Library</Heading>

        <LibrarySection title="My Albums">
          <Box mt={4} px={4}>
            <AlbumList />
            <Button mt={2} onClick={onOpen} colorScheme="blue">Create album</Button>
          </Box>
        </LibrarySection>

        <Spacer h={2} />

        <LibrarySection title="Upload music">
          <Box mt={4} px={4}>
            <MusicUpload albums={albums || []} />
          </Box>
        </LibrarySection>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Album</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Album Name</FormLabel>
              <Input placeholder="Provide a name for the new album" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreateAlbum}>
              Create
            </Button>
            <Button variant='ghost' onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LibraryPage;
