import AccountManagement from "@/components/Auth/AccountManagement";
import LibrarySection from "@/components/Library/LibrarySection";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/types";
import { postWithCsrfToken, validateDescription, validateName, validateOTP, validatePwd } from "@/utils";
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

type ProfileFormData = {
  name: string;
  about: string;
  password: string;
  newPassword: string;
  otp: string;
};

const AccountPage: NextPage = () => {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<ProfileFormData>({
    name: "",
    about: "",
    password: "",
    newPassword: "",
    otp: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push("/auth");
    } else {
      setEmail(user.email);
      setForm({
        ...form,
        name: user.name,
        about: user.about || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  if (userLoading) {
    return <Center><CircularProgress isIndeterminate color="blue.300" /></Center>;
  } else if (!user) {
    router.push("/auth"); // redirect to home page if not authenticated
    return <>Redirecting to login page...</>;
  }

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (form.name != user.name) {
      if (!validateName(form.name)) {
        setError("Please enter a name that is 3-64 chars long. (Letters, numbers, and space only)");
        return;
      }
      formData.append("name", form.name);
    }
    if (form.about != user.about) {
      if (!validateDescription(form.about)) {
        setError("Please enter an about that is 3-250 chars long.");
        return;
      }
      formData.append("about", form.about);
    }
    if (form.password != "" || form.newPassword != "" || form.otp != "") {
      if (!validatePwd(form.password)) {
        setError("Your current password is empty.");
        return;
      }
      if (!validatePwd(form.newPassword, true)) {
        setError("Please enter a new password that is at least 12 characters long.");
        return;
      }
      if (!validateOTP(form.otp)) {
        setError("Please enter a valid 6 digit OTP.");
        return;
      }
      formData.append("password", form.password);
      formData.append("newPassword", form.newPassword);
      formData.append("mfa", form.otp);
    }

    if (formData.entries().next().done) {
      setError("No changes detected.");
      return;
    }

    if (!confirm("Are you sure you want to update your profile?")) return;

    const res = await postWithCsrfToken(`${API_URL}/user/update`, formData);

    if (!res.ok) {
      if (res.status == 400) {
        let resText = await res.text();
        setError(resText);
      } else if (res.status == 401) {
        setError("Incorrect password or OTP.");
      } else {
        setError("Error occured while updating profile.");
      }
      return;
    }

    router.reload();
  };

  let hasChanges = user
    ? form.name != user.name ||
    form.about != user.about ||
    form.password != "" ||
    form.newPassword != "" ||
    form.otp != ""
    : false;

  return (
    <Box w="100%" p={8}>
      <Heading size="md" mb={4}>
        Account
      </Heading>

      <LibrarySection title="Profile Information">
        <form onSubmit={handleProfileSubmit}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} disabled />
          </FormControl>

          <FormControl
            id="name"
            mt={4}
            isRequired
            isInvalid={user ? form.name != user.name : false}
          >
            <FormLabel mt={4}>Display Name</FormLabel>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <FormHelperText>
              How you will appear to others on Solarta. (64 chars max)
            </FormHelperText>
          </FormControl>

          <FormControl
            id="about"
            mt={4}
            isInvalid={user ? form.about != user.about : false}
          >
            <FormLabel mt={4}>About</FormLabel>
            <Textarea
              value={form.about}
              onChange={(e) => setForm({ ...form, about: e.target.value })}
            />
            <FormHelperText>
              Tell us about yourself. (250 chars max)
            </FormHelperText>
          </FormControl>

          <FormControl
            id="password"
            mt={4}
            isInvalid={
              form.password != "" || form.newPassword != "" || form.otp != ""
            }
          >
            <FormLabel mt={4}>Change Password</FormLabel>
            <Input
              type="password"
              placeholder="Current Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New Password"
              mt={2}
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="MFA OTP"
              mt={2}
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
            <FormHelperText>
              Passwords must be at least 12 characters long.
            </FormHelperText>
          </FormControl>

          <Flex align="center" mt={4}>
            <Button colorScheme="blue" type="submit">
              Save Changes
            </Button>
            {error && (
              <Text color="red.300" ml={4}>
                {error}
              </Text>
            )}
            {!error && hasChanges && (
              <Text color="red.300" ml={4}>
                Changes are highlighted in red.
              </Text>
            )}
          </Flex>
        </form>
      </LibrarySection>

      <Spacer h={2} />

      <LibrarySection title="Account Management">
        <AccountManagement />
      </LibrarySection>
    </Box>
  );
};

export default AccountPage;
