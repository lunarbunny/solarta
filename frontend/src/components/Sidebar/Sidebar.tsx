import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import Playlists from "./Playlists";
import { TbMusic } from "react-icons/tb";
import { IoLibraryOutline } from "react-icons/io5";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "@/atoms/auth";
import useSignOut from "@/hooks/useSignOut";

const Sidebar = () => {
  const [page, setPage] = useState("");

  const [auth] = useRecoilState(authAtom);
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

      <Flex direction="row" align="flex-end" p={4}>
        {auth.accessToken ? (
          <>
            <Text fontSize="md" noOfLines={1}>
              {auth.email}
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
