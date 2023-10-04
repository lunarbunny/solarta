import React from "react";
import MusicPlayer from "./Media/MusicPlayer";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar/Sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Flex h="100vh" direction="column">
      {/* <Navbar /> */}
      <Box as="main" flexGrow={1}>
        <Flex flexDir="row" h="100%" w="100%">
          <Sidebar />
          {children}
        </Flex>
      </Box>
      <Box boxShadow="0px 0px 5px 0px rgba(0,0,0,0.75)" w="100%">
        <MusicPlayer name="THIS IS THE FIRE" artist="imagine fire" durationSec={150} />
      </Box>
    </Flex>
  );
}

export default Layout;