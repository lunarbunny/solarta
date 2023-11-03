import { Text, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { API_URL, Album } from "@/types";
import AlbumWrap from "../Media/AlbumWrap";
import { useRouter } from "next/router";
import { validateDescription, validateName } from "@/utils";

type Props = {
  albums: Album[],
}

type AlbumForm = {
  title: string;
  releaseDate: string;
  description: string;
};

const AlbumManagement: React.FC<Props> = ({ albums }) => {
  const router = useRouter();

  // For modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [albumForm, setAlbumForm] = useState<AlbumForm>({
    title: '',
    releaseDate: new Date().toISOString().slice(0, 10),
    description: '',
  });

  const [error, setError] = useState('');
  const [titleHasError, setTitleHasError] = useState(false);
  const [relDateHasError, setReleDateHasError] = useState(false);
  const [descHasError, setDescHasError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error message
    if (error) setError('');
    if (titleHasError) setTitleHasError(false);
    if (relDateHasError) setReleDateHasError(false);
    if (descHasError) setDescHasError(false);

    // Validatation
    if (!validateName(albumForm.title)) {
      setError('Please enter a title that is 3-64 chars long.');
      setTitleHasError(true);
      return;
    }

    if (!albumForm.releaseDate) {
      setError('Please enter a release date.');
      setReleDateHasError(true);
      return;
    }

    if (!validateDescription(albumForm.description)) {
      setError('Please enter a description that is 3-64 chars long.');
      setDescHasError(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', albumForm.title);
    formData.append('releaseDate', albumForm.releaseDate);
    formData.append('description', albumForm.description);

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
      let resText = await res.text();
      alert("Error: Could not create album. Reason: " + resText);
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
              <FormControl isInvalid={titleHasError}>
                <FormLabel>Album Name</FormLabel>
                <Input
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  placeholder="Provide a name for the new album"
                />
              </FormControl>
              <FormControl mt={4} isInvalid={relDateHasError}>
                <FormLabel>Release Date</FormLabel>
                <Input
                  type="date"
                  value={albumForm.releaseDate}
                  onChange={(e) => setAlbumForm({ ...albumForm, releaseDate: e.target.value })}
                  placeholder="Provide a release date for the new album"
                />
              </FormControl>
              <FormControl mt={4} isInvalid={descHasError}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  placeholder="Describe the new album"
                />
              </FormControl>

              <Text mt={2} fontSize="12pt" color="red.300">
                {error}
              </Text>
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