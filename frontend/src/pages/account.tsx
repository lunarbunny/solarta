import LibrarySection from "@/components/Library/LibrarySection";
import useAuth from "@/hooks/useAuth";
import { API_URL } from "@/types";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Spacer,
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

type ConfirmPasswordData = {
  password: string;
  cfmPassword: string;
  otp: string;
};

const AccountPage: NextPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<ProfileFormData>({
    name: "",
    about: "",
    password: "",
    newPassword: "",
    otp: "",
  });

  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [confirmPwdForm, setConfirmPwdForm] = useState<ConfirmPasswordData>({
    password: "",
    cfmPassword: "",
    otp: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth");
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

    if (!user) return;

    if (!confirm("Are you sure you want to update your profile?")) return;

    const formData = new FormData();
    if (form.name != user.name) {
      formData.append("name", form.name);
    }
    if (form.about != user.about) {
      formData.append("about", form.about);
    }
    if (form.password != "" && form.newPassword != "" && form.otp != "") {
      formData.append("password", form.password);
      formData.append("newPassword", form.newPassword);
      formData.append("mfa", form.otp);
    }

    const res = await fetch(`${API_URL}/user/update`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      router.reload();
    } else {
      alert("Error: Could not update profile.");
    }
  };

  const handleDeleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("password", confirmPwdForm.password);
    formData.append("cfmPassword", confirmPwdForm.cfmPassword);
    formData.append("mfa", confirmPwdForm.otp);

    const res = await fetch(`${API_URL}/user/delete`, {
      method: "DELETE",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      router.push("/auth");
    } else {
      alert("Error: Unable to delete account.");
    }
  };

  const handleDeleteModal = () => {
    setDeleteModalOpen(!isDeleteModalOpen);
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
          </FormControl>

          <Flex align="center" mt={4}>
            <Button colorScheme="blue" type="submit">
              Save Changes
            </Button>
            {hasChanges && (
              <Text color="red.300" ml={4}>
                Changes are highlighted in red.
              </Text>
            )}
          </Flex>
        </form>
      </LibrarySection>

      <Spacer h={2} />

      <LibrarySection title="Account Management">
        <Flex mt={4} p={2}
          flexDir="column"
          align="flex-start"
          border="2px dotted"
          borderColor="red.300"
          borderRadius="md">
          <Heading size="sm" color="red.300">Danger Zone</Heading>
          <Button mt={4} alignSelf="flex-start" colorScheme="red" type="submit" onClick={handleDeleteModal}>
            Delete Account
          </Button>
          <Text mt={1} color="gray.300">Deleting your account is permanent and cannot be undone.</Text>
        </Flex>

        <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleDeleteAccount}>
                <FormControl
                  id="confirmPassword"
                  mt={4}
                  isInvalid={
                    confirmPwdForm.password != "" ||
                    confirmPwdForm.cfmPassword != "" ||
                    confirmPwdForm.otp != ""
                  }
                >
                  <FormLabel>Enter password to confirm:</FormLabel>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={confirmPwdForm.password}
                    onChange={(e) =>
                      setConfirmPwdForm({
                        ...confirmPwdForm,
                        password: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    mt={2}
                    value={confirmPwdForm.cfmPassword}
                    onChange={(e) =>
                      setConfirmPwdForm({
                        ...confirmPwdForm,
                        cfmPassword: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="MFA OTP"
                    mt={2}
                    value={confirmPwdForm.otp}
                    onChange={(e) =>
                      setConfirmPwdForm({
                        ...confirmPwdForm,
                        otp: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <Flex align="center" mb={4} mt={4}>
                  <Button colorScheme="blue" type="submit">
                    Confirm
                  </Button>
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </LibrarySection>
    </Box>
  );
};

export default AccountPage;
