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
      <Box flexGrow={1}>
        <Flex direction="row" h="100%">
          <Sidebar />
          <Box overflowY="scroll">
            {children}
          </Box>
        </Flex>
      </Box>
      <Box boxShadow="0px 0px 5px 0px rgba(0,0,0,0.75)" w="100%">
        <MusicPlayer />
      </Box>
    </Flex>
  );
};

export default Layout;
