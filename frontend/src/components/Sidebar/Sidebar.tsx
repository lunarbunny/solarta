import useAuth from "@/hooks/useAuth";
import useSignOut from "@/hooks/useSignOut";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { IoLibraryOutline } from "react-icons/io5";
import { MdAlbum, MdPortrait } from "react-icons/md";
import { TbMusic } from "react-icons/tb";
import Playlists from "./Playlists";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const [page, setPage] = useState("");
  const { user } = useAuth();
  const { signOut, loading, error } = useSignOut();

  return (
    <Flex
      color="whiteAlpha.500"
      minW="250px"
      h="100%"
      bg="blue.900"
      direction="column"
      align="space-between"
    >
      <Link href="/">
        <Flex direction="row" cursor="pointer" px={5} py={8}>
          <Image src="/favicon.ico" height="32px" alt="solarta" />
          <Text ml={2} fontWeight="bold" fontSize="2xl" mb="-4px">
            Solarta
          </Text>
        </Flex>
      </Link>

      <Box flexGrow={1}>
        <SidebarGroup title="DISCOVER" hasButton={false}>
          <Link href="/" onClick={() => setPage("home")}>
            <SidebarItem name="Home" icon={<TbMusic size={20} />} />
          </Link>
          <Link href="/artists" onClick={() => setPage("library")}>
            <SidebarItem name="Artists" icon={<MdPortrait size={20} />} />
          </Link>
          <Link href="/albums" onClick={() => setPage("library")}>
            <SidebarItem name="Albums" icon={<MdAlbum size={20} />} />
          </Link>
          <Link href="/library" onClick={() => setPage("library")}>
            <SidebarItem name="My Library" icon={<IoLibraryOutline size={20} />} />
          </Link>
        </SidebarGroup>

        <SidebarGroup title="PLAYLISTS" hasButton={true}>
          <Playlists />
        </SidebarGroup>
      </Box>

      <Flex direction="row" align="flex-end" p={4}>
        {user ? (
          <>
            <Text fontSize="md" noOfLines={1}>
              {user.email}
            </Text>
            <Button size="sm" onClick={signOut}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Sidebar;
