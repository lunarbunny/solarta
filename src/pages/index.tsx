import Auth from "@/components/Auth/Auth";
import { auth } from "@/firebase/clientApp";
import { Center, CircularProgress } from "@chakra-ui/react";
import { NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center>
        <CircularProgress isIndeterminate color='green.300' />
      </Center>
    )
  }

  if (!user) {
    return (
      <>
        <Auth />
      </>
    )
  }

  return (
    <>
      <h1>Logged in, this is the home page.</h1>
    </>
  )
}

export default Home;
