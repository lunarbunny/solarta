import useFetch from "@/hooks/useFetch";
import { API_URL, Album, Artist, Music } from "@/types";
import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdMusicalNote } from "react-icons/io";
import { MdAlbum } from "react-icons/md";
import { User } from "@/types";

import UserStats from "../components/Admin/UserStats";

import { NextPage } from "next";

const AdminPage: NextPage = () => {
  const { data: users } = useFetch<User[]>(`${API_URL}/user/`, {
    includeCred: true,
  });

  let numOfUsers: number = 0;
  if (users) {
    numOfUsers = users.length;
  }
  const dummyData = [
    {
      metric: "Number of users",
      value: numOfUsers,
    },
    {
      metric: "Number of Songs",
      value: 200,
    },
    {
      metric: "Number of Albums",
      value: 50,
    },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();

  function returnStatus(status: number) {
    if (status == 0) {
      return "OK";
    } else if (status == 1) {
      return "BANNED";
    } else {
      return "NOT_VERIFIED";
    }
  }
  return (
    <Box h="100%" w="100%" py={8} px={0}>
      <Flex h="30%" justify="space-evenly">
        <UserStats data={dummyData[0]} icon={AiOutlineUser} />
        <UserStats data={dummyData[1]} icon={IoMdMusicalNote} />
        <UserStats data={dummyData[2]} icon={MdAlbum} />
      </Flex>
      <Box
        my={2}
        h="70%"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "10px",
            borderRadius: "500px",
            backgroundColor: `rgba(65, 62, 63, 0.8)`,
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "500px",
            backgroundColor: `rgba(251, 154, 0, 0.8)`,
          },
        }}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>About</Th>
              <Th>Status</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users &&
              users.map((data, index) => (
                <Tr key={index}>
                  <Td>{data.name}</Td>
                  <Td>{data.email}</Td>
                  <Td>{data.about}</Td>
                  <Td>{returnStatus(data.status)}</Td>
                  <Td isNumeric>
                    <Button
                      _hover={{ bg: "red.600" }}
                      bg="blue.700"
                      color="whiteAlpha.900"
                      onClick={onOpen}
                    >
                      BAN
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        {/* <form onSubmit={""}> */}
        <ModalContent>
          <ModalHeader>Ban User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to ban {"user's name"} for xxx days?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button bg="red.500" mr={3} type="submit" onClick={onClose}>
              Yes
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
        {/* </form> */}
      </Modal>
    </Box>
  );
};

export default AdminPage;
