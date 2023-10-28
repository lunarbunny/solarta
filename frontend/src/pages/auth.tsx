import Auth from "@/components/Auth/Auth";
import useAuth from "@/hooks/useAuth";
import { Box } from "@chakra-ui/react";
import { NextPage } from "next";

const AuthPage: NextPage = () => {
  const { user } = useAuth();

  if (user) {
    // Redirect if user is already logged in
    window.location.href = "/";
  }

  return (
    <Auth />
  );
}

export default AuthPage;
