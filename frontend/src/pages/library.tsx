import Auth from "@/components/Auth/Auth";
import LibrarySection from "@/components/Library/LibrarySection";
import MusicUpload from "@/components/Library/MusicUpload";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Divider, Heading, Spacer } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoAlbums } from "react-icons/io5";
import { TbAlbum } from "react-icons/tb";

const LibraryPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

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
    <Box w='100%'>
      <Heading px={4} pt={3} pb={2} size='md'>Library</Heading>
      <Divider />

      <LibrarySection title="Media Library">
        <Heading size='sm'>Albums</Heading>
        <SidebarItem name="Album 1" icon={<TbAlbum />} />

        <Heading size='sm'>My Music</Heading>
        <SidebarItem name="Album 1" icon={<TbAlbum />} />
      </LibrarySection>

      <Spacer h={2} />

      <MusicUpload />
    </Box>
  );
}

export default LibraryPage;
