import React from "react";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <>
    <Navbar/>
    <main>
      {children}
    </main>
  </>;
}

export default Layout;