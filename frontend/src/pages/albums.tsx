import Auth from "@/components/Auth/Auth";
import { auth } from "@/firebase/clientApp";
import { Box, Center, CircularProgress, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center w="100%">
        <CircularProgress isIndeterminate color='blue.700' />
      </Center>
    )
  }

  if (!user) {
    return (
      <Auth />
    )
  }

  return (
    <Box>
      <Text>Albums</Text>
    </Box>
  );
}

export default HomePage;
