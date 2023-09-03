import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase/clientApp";
import { useSignOut } from "react-firebase-hooks/auth";

type RightContentProps = {
  user: User;
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  const [signOut, loading, error] = useSignOut(auth);

  return (
    <Flex align="center">
      <Avatar size="sm" name="User Avatar" />
      <Text ml={2} mt={1} fontSize="14pt">{user.email}</Text>
      <Button ml={2} size="sm" onClick={signOut} isLoading={loading}>Logout</Button>
    </Flex>
  );
}

export default RightContent;
