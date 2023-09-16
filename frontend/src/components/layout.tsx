import React from "react";
import Navbar from "./NavBar/NavBar";
import MusicPlayer from "./Media/MusicPlayer";
import { Flex } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <>
    <Navbar />
    <main>
      {children}
      <MusicPlayer name="THIS IS THE FIRE" artist="imagine fire" durationSec={150} />
    </main>
  </>;
}

export default Layout;