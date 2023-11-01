import { API_URL } from "@/types";
import { Box, Button, Center, Container, Flex, FormControl, FormHelperText, Heading, Input, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import QRCode from "react-qr-code";

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const resetToken = router.query.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpToken, setOtpToken] = useState("");
  const [resetError, setResetError] = useState("");

  const doResetPassword = async () => {
    if (password !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('newPassword', password);

    let res = await fetch(`${API_URL}/user/reset/${resetToken}`, {
      method: "POST",
    });

    if (!res.ok) {
      setResetError("Invalid token");
      return;
    } else {
      let otpToken = await res.text();
      setOtpToken(otpToken);
      setResetError("");
    }
  }

  return (
    <Center h="100%">
      <Container bg="#364259" borderRadius={8} p={4} w="auto">
        <Heading textAlign="center" color="white">Solarta Reset Password</Heading>

        <form>
          <FormControl>
            <Input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <FormControl mt={2}>
            <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <FormHelperText>
              If you reset your password, you must setup MFA again.
            </FormHelperText>
          </FormControl>

          {resetError && (
            <Text textAlign="center" mt={2} fontSize="12pt" color="red.300" noOfLines={2}>
              {resetError}
            </Text>
          )}

          <Button w="100%" borderRadius={32} mt={2}
            onClick={doResetPassword}>
            Reset Password
          </Button>
        </form>

        {otpToken && (
          <Flex direction="row">
            <Box m={2} p={2} bg='white'>
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
      </Container>
    </Center>
  );
};

export default ResetPasswordPage;
