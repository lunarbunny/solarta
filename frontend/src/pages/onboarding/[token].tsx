import { API_URL } from "@/types";
import { Box, Center, CircularProgress, Container, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const OnboardingPage: NextPage = () => {
  const router = useRouter();
  const onboardToken = router.query.token;

  const [otpToken, setOtpToken] = useState("");
  const [onboardErr, setOnboardErr] = useState("");

  const doOnboarding = async (onboardToken: string) => {
    if (otpToken) return;

    let res = await fetch(`${API_URL}/user/onboarding/${onboardToken}`);

    if (!res.ok) {
      setOnboardErr("Invalid token");
      return;
    } else {
      let otpToken = await res.text();
      setOtpToken(otpToken);
      setOnboardErr("");
    }
  }

  useEffect(() => {
    console.log(onboardToken);
    if (onboardToken && !otpToken) {
      doOnboarding(onboardToken as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardToken]);

  return (
    <Center h="100%">
      <Container bg="#364259" borderRadius={8} p={4} w="auto">
        <Heading textAlign="center" color="white">Solarta Onboarding</Heading>
        {!otpToken && !onboardErr && (
          <CircularProgress isIndeterminate color="white" />
        )}
        {otpToken && (
          <Flex direction="row">
            <Box p={4}>
              <QRCode size={256} value={otpToken} />
            </Box>
            <Flex p={4} direction="column">
              <Box flexGrow={1}>
                <Text>To complete onboarding, please scan the QR code on the left with your authenticator app.</Text>
                <Text>You need it generate a one-time password (OTP) that you will use to log in.</Text>
              </Box>
              <Link href="/auth">
                <Text color="blue.300" cursor="pointer" textDecoration="underline">
                  Click here to log in
                </Text>
              </Link>
            </Flex>
          </Flex>
        )}
        {!otpToken && onboardErr && <Text>{onboardErr}</Text>}
      </Container>
    </Center>
  );
};

export default OnboardingPage;
