import React from "react";
import Navbar from "./NavBar/NavBar";
import MusicPlayer from "./Media/MusicPlayer";
import { Box, Flex } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <Flex h="100vh" direction="column">
    <Navbar />
    <Box flexGrow={1}>
      <main>
        {children}
      </main>
    </Box>
    <MusicPlayer name="THIS IS THE FIRE" artist="imagine fire" durationSec={150} />
  </Flex>;
}

export default Layout;