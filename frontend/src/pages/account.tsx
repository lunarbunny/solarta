import LibrarySection from "@/components/Library/LibrarySection";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/types";
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, Textarea, FormHelperText, Flex } from "@chakra-ui/react";
import { NextPage } from "next";
import router from "next/router";
import { FormEvent, useEffect, useState } from "react";

type ProfileFormData = {
  name: string;
  about: string;
  password: string;
  newPassword: string;
  otp: string;
};

const AccountPage: NextPage = () => {
  const { user, loading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<ProfileFormData>({
    name: "",
    about: "",
    password: "",
    newPassword: "",
    otp: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/auth');
    } else {
      setEmail(user.email);
      setForm({
        ...form,
        name: user.name,
        about: user.about,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to update your profile?")) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("about", form.about);
    formData.append("password", form.password);
    formData.append("newPassword", form.newPassword);
    formData.append("mfa", form.otp);

    const res = await fetch(`${API_URL}/user/update`, {
      method: "POST",
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      router.reload();
    } else {
      alert("Error: Could not update profile.");
    }
  }

  let hasChanges = user ? (
    form.name != user.name || form.about != user.about ||
    form.password != "" || form.newPassword != "" || form.otp != ""
  ) : false;

  return (
    <Box w="100%" p={8}>
      <Heading size='md' mb={4}>Account</Heading>

      <LibrarySection title="Profile Information">
        <form onSubmit={handleProfileSubmit}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} disabled />
          </FormControl>

          <FormControl id="name" mt={4} isRequired isInvalid={user ? form.name != user.name : false}>
            <FormLabel mt={4}>Display Name</FormLabel>
            <Input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormHelperText>How you will appear to others on Solarta. (64 chars max)</FormHelperText>
          </FormControl>

          <FormControl id="about" mt={4} isInvalid={user ? form.about != user.about : false}>
            <FormLabel mt={4}>About</FormLabel>
            <Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
            <FormHelperText>Tell us about yourself. (250 chars max)</FormHelperText>
          </FormControl>

          <FormControl id="password" mt={4} isInvalid={form.password != "" || form.newPassword != "" || form.otp != ""}>
            <FormLabel mt={4}>Change Password</FormLabel>
            <Input type="password" placeholder="Current Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input type="password" placeholder="New Password" mt={2} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            <Input type="number" placeholder="MFA OTP" mt={2} value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />
          </FormControl>

          <Flex align="center" mt={4}>
            <Button colorScheme="blue" type="submit" disabled={!hasChanges}>Save Changes</Button>
            {hasChanges && <Text color="red.300" ml={4}>Changes are highlighted in red.</Text>}
          </Flex>
        </form>

      </LibrarySection>
    </Box>
  );
};

export default AccountPage;
