import Auth from "@/components/Auth/Auth";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { auth } from "@/firebase/clientApp";
import useFetch from "@/hooks/useFetch";
import { API_URL, Album } from "@/types";
import { Box, Button, Center, CircularProgress, Divider, Heading, IconButton, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, InputRightElement, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { TbAlbum, TbPlus } from "react-icons/tb";

const LibraryPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  const onCreateAlbum = useCallback(() => {
    console.log('create album');

  }, []);

  if (loading) {
    return (
      <Center w="100%">
        <CircularProgress isIndeterminate color='blue.700' />
      </Center>
    )
  }

  if (!user) {
    return (
      <Auth />
    )
  }

  return (
    <Box w='100%' p={8}>
      <Heading size='md'>Library</Heading>

      <LibrarySection title="My Albums">
        <Box mt={4} px={4}>
          <InputGroup>
            <InputLeftElement children={<TbAlbum />} pointerEvents='none' />
            <Input type="text" placeholder="Album name" />
            <InputRightElement>
              <IconButton aria-label="Add album" icon={<TbPlus />} onClick={onCreateAlbum} />
            </InputRightElement>
          </InputGroup>
          {albums && albums.map((album, index) => (
            <SidebarItem key={index} name={album.title} icon={<TbAlbum />} />
          ))}
        </Box>
      </LibrarySection>

      <Spacer h={2} />

      <LibrarySection title="Upload music">
        <MusicUpload albums={albums || []} />
      </LibrarySection>
    </Box>
  );
}

export default LibraryPage;
