import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { API_URL, Album } from "@/types";
import AlbumWrap from "../Media/AlbumWrap";
import { useRouter } from "next/router";

type Props = {
  albums: Album[],
}

type AlbumForm = {
  title: string;
  releaseDate: string;
  description: string;
  imageUrl: string | null;
};

const AlbumManagement: React.FC<Props> = ({ albums }) => {
  const router = useRouter();

  // For modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [albumForm, setAlbumForm] = useState<AlbumForm>({
    title: '',
    releaseDate: new Date().toISOString().slice(0, 10),
    description: '',
    imageUrl: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(albumForm);

    const formData = new FormData();
    formData.append('title', albumForm.title);
    formData.append('releaseDate', albumForm.releaseDate);
    formData.append('description', albumForm.description);
    if (albumForm.imageUrl) {
      formData.append('imageUrl', albumForm.imageUrl);
    }

    const res = await fetch(`${API_URL}/album/create`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      let data = await res.json();
      let newAlbumId = data.id;
      router.push(`/album/${newAlbumId}`);
    } else {
      alert("Error: Could not create album.");
    }
  }

  return (
    <>
      <Flex direction='row' flexShrink={1}>
        <AlbumWrap items={albums} clickable onCreateClick={onOpen} />
      </Flex>

      {/* Create Album Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Album</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Album Name</FormLabel>
                <Input
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  placeholder="Provide a name for the new album"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Release Date</FormLabel>
                <Input
                  type="date"
                  value={albumForm.releaseDate}
                  onChange={(e) => setAlbumForm({ ...albumForm, releaseDate: e.target.value })}
                  placeholder="Provide a release date for the new album"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  placeholder="Describe the new album"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Cover URL</FormLabel>
                <Input
                  value={albumForm.imageUrl || ''}
                  onChange={(e) => setAlbumForm({ ...albumForm, imageUrl: e.target.value })}
                  placeholder="Provide a URL for the album cover"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} type='submit'>
                Create
              </Button>
              <Button variant='ghost' onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form >
      </Modal>
    </>
  );
}

export default AlbumManagement;