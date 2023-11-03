import { API_URL } from '@/types';
import { Button, Divider, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import router from 'next/router';
import React, { FormEvent, useState } from 'react';

type ConfirmPasswordData = {
  password: string;
  otp: string;
};

const AccountManagement: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [confirmPwdForm, setConfirmPwdForm] = useState<ConfirmPasswordData>({
    password: "",
    otp: "",
  });

  const handleDeleteAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("password", confirmPwdForm.password);
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

  return (
    <>
      <Flex mt={4} p={2}
        flexDir="column"
        align="flex-start"
        border="2px dotted"
        borderColor="red.300"
        borderRadius="md">
        <Heading size="sm" color="red.300">Danger Zone</Heading>
        <Button mt={4} alignSelf="flex-start" colorScheme="red" type="submit" onClick={onOpen}>
          Delete Account
        </Button>
        <Text mt={1} color="gray.300">Deleting your account is permanent and cannot be undone.</Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleDeleteAccount}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete My Solarta Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color="red.300">
                Deleting your account is permanent and cannot be undone. To confirm, please enter your current password and MFA OTP.
              </Text>
              <Divider mt={2} mb={2} />
              <FormControl isInvalid={confirmPwdForm.password != ""}>
                <FormLabel>Current password</FormLabel>
                <Input
                  type="password"
                  value={confirmPwdForm.password}
                  onChange={(e) =>
                    setConfirmPwdForm({
                      ...confirmPwdForm,
                      password: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl mt={2} isInvalid={confirmPwdForm.otp != ""}>
                <FormLabel>MFA OTP</FormLabel>
                <Input
                  type="number"
                  value={confirmPwdForm.otp}
                  onChange={(e) =>
                    setConfirmPwdForm({
                      ...confirmPwdForm,
                      otp: e.target.value,
                    })
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} type='submit'>
                Delete Account
              </Button>
              <Button variant='ghost' onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

export default AccountManagement;


