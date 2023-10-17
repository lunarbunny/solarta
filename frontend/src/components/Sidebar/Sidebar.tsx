import { Box, Flex, Text, Image, Avatar, Button } from "@chakra-ui/react";
import Playlists from "./Playlists";
import { TbAlbum, TbMusic } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { IoLibraryOutline } from "react-icons/io5";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { useState } from "react";
import { auth } from "@/firebase/clientApp";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const Sidebar = () => {
  const [page, setPage] = useState("");

  const [user] = useAuthState(auth);
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <Flex minW="250px" h="100%" bgGradient="linear(to-l, blue.700, blue.900)"
      direction="column" align="space-between">
      <Link href="/">
        <Flex direction="row" cursor="pointer" px={5} py={8}>
          <Image src="/favicon.ico" height="32px" />
          <Text ml={2} fontWeight="bold" fontSize="2xl" mb="-4px">
            Solarta
          </Text>
        </Flex>
      </Link>

      <Box flexGrow={1}>
        <SidebarGroup title="DISCOVER" hasButton={false}>
          <Link href="/" onClick={() => setPage("home")}>
            <SidebarItem name="Songs" icon={<TbMusic size={20} />} />
          </Link>
          <Link href="/artists" onClick={() => setPage("artists")}>
            <SidebarItem name="Artists" icon={<FiUsers size={20} />} />
          </Link>
          <Link href="/albums" onClick={() => setPage("albums")}>
            <SidebarItem name="Albums" icon={<TbAlbum size={20} />} />
          </Link>
          <Link href="/library" onClick={() => setPage("library")}>
            <SidebarItem
              name="My Library"
              icon={<IoLibraryOutline size={20} />}
            />
          </Link>
        </SidebarGroup>

        <SidebarGroup title="PLAYLISTS" hasButton={true}>
          <Playlists />
        </SidebarGroup>
      </Box>

      {user && (
        <Flex direction="row" align="flex-end" p={4}>
          <Text fontSize="md" noOfLines={1}>{user.email}</Text>
          <Button size="sm" onClick={signOut} isLoading={loading}>Logout</Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Sidebar;
