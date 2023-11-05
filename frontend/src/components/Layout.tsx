import React from "react";
import MusicPlayer from "./Media/MusicPlayer";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Flex
      as="main"
      direction="column"
      bg="blackAlpha.500"
      h="100vh"
      position="relative"
      zIndex={0}
    >
      <Flex flexGrow={4} direction="row">
        <Sidebar />
        <Box w="100%" maxH="100%">
          {children}
        </Box>
      </Flex>
      <Box zIndex={1} position="absolute" left="0" right="0" bottom="0">
        <MusicPlayer />
      </Box>
    </Flex>
  );
};

export default Layout;
