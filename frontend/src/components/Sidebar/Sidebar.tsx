import useAuth from "@/hooks/useAuth";
import useSignOut from "@/hooks/useSignOut";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { IoLibraryOutline } from "react-icons/io5";
import { MdAdminPanelSettings, MdAlbum, MdOutlineAdminPanelSettings, MdOutlineAlbum, MdPortrait } from "react-icons/md";
import { TbMusic } from "react-icons/tb";
import Playlists from "./Playlists";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";
import { useRouter } from "next/router";

const Sidebar = () => {
  const { user } = useAuth();
  const { signOut } = useSignOut();
  const [page, setPage] = useState("home");

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
            <SidebarItem name="Home" icon={<TbMusic size={20} />} bolded={page == 'home'} />
          </Link>
          <Link href="/artists" onClick={() => setPage("artists")}>
            <SidebarItem name="Artists" icon={<MdPortrait size={20} />} bolded={page == 'artists'} />
          </Link>
          <Link href="/albums" onClick={() => setPage("albums")}>
            <SidebarItem name="Albums" icon={<MdOutlineAlbum size={20} />} bolded={page == 'albums'} />
          </Link>
          {
            user && !user.admin && (
              <Link href="/library" onClick={() => setPage("library")}>
                <SidebarItem name="My Library" icon={<IoLibraryOutline size={20} />} bolded={page == 'library'} />
              </Link>
            )
          }
          {
            user && user.admin && (
              <Link href="/admin" onClick={() => setPage("admin")}>
                <SidebarItem name="Admin" icon={<MdOutlineAdminPanelSettings size={20} />} bolded={page == 'admin'} />
              </Link>
            )
          }
          {
            user && (
              <Link href="/account" onClick={() => setPage("account")}>
                <SidebarItem name="Account" icon={<MdPortrait size={20} />} bolded={page == 'account'} />
              </Link>
            )
          }
        </SidebarGroup>

        {user && !user.admin && (
          <SidebarGroup title="PLAYLISTS" hasButton={true}>
            <Playlists />
          </SidebarGroup>
        )}
      </Box>
      <Flex direction="column" p={4}>
        {user ? (
          <>
            <Text fontSize="md" noOfLines={1} color="gray.300">
              Welcome,
            </Text>
            <Link href="/account">
              <Text fontWeight="bold" noOfLines={1} color="gray.300">
                {user.name}
              </Text>
            </Link>
            <Button size="sm" onClick={signOut} variant={"outline"}>
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
