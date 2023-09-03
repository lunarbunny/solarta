import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import RightContent from "./RightContent";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex bgGradient="linear(to-l, blue.700, blue.900)" height='50px' paddingX={2} justifyContent="space-between">
      {/* Icon and app name */}
      <Flex alignItems="center">
        <Image src="/favicon.ico" height="32px" mr={2} />
        <Text fontSize="16pt" mt={1}>Solarta</Text>
      </Flex>

      {user && <RightContent user={user} />}
    </Flex>
  );
}

export default Navbar;