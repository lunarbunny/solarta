import React from "react";
import MusicPlayer from "./Media/MusicPlayer";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Flex as="main" direction="column" bg="blackAlpha.500" h="100vh">
      <Flex flexGrow={4} direction="row">
        <Sidebar />
        <Box w="100%" overflowY="scroll">
          {children}
        </Box>
      </Flex>
      <Box boxShadow="0px 0px 5px 0px rgba(0,0,0,0.75)">
        <MusicPlayer />
      </Box>
    </Flex>
  );
};

export default Layout;
