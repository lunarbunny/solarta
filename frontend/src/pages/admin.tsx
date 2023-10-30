import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import { API_URL, Album, Music, User } from "@/types";
import { NextPage } from "next";
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
import { MdAlbum } from "react-icons/md";
import UserStats from "../components/Admin/UserStats";
import { durationToTime, formatDate } from "@/utils";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdMusicalNote } from "react-icons/io";

const AdminPage: NextPage = () => {
  const [selectedTable, setSelectedTable] = useState("Users");
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedSong, setSelectedSong] = useState({
    id: 0,
    title: "",
  });
  const {
    isOpen: isUserOpen,
    onOpen: onUserOpen,
    onClose: onUserClose,
  } = useDisclosure();

  const {
    isOpen: isSongOpen,
    onOpen: onSongOpen,
    onClose: onSongClose,
  } = useDisclosure();

  const { data: users } = useFetch<User[]>(`${API_URL}/user/`, {
    includeCred: true,
  });
  const { data: songs } = useFetch<Music[]>(`${API_URL}/music/`, {
    includeCred: true,
  });
  const { data: albums } = useFetch<Album[]>(`${API_URL}/album/`, {
    includeCred: true,
  });

  let numOfUsers: number = 0;
  if (users) {
    numOfUsers = users.length;
  }

  let numOfSongs: number = 0;
  if (songs) {
    numOfSongs = songs.length;
  }

  let numOfAlbums: number = 0;
  if (albums) {
    numOfAlbums = albums.length;
  }
  const headers = [
    {
      metric: "Number of Users",
      value: numOfUsers,
    },
    {
      metric: "Number of Songs",
      value: numOfSongs,
    },
    {
      metric: "Number of Albums",
      value: numOfAlbums,
    },
  ];

  function returnStatus(status: number) {
    if (status == 0) {
      return "OK";
    } else if (status == 1) {
      return "BANNED";
    } else {
      return "NOT_VERIFIED";
    }
  }

  const handleSubmitSongDelete = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    console.log(`${API_URL}/music/delete/${selectedSong.id.toString()}`);
    const response = await fetch(`${API_URL}/music/delete/${selectedSong.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      location.reload();
    } else {
      console.log(response);
    }
  };

  const handleSubmitUserDelete = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/user/${selectedUser}/ban`, {
      method: "POST",
    });
    if (response.ok) {
      location.reload();
    } else {
      console.log(response);
    }
  };

  return (
    <Box h="100%" w="100%" py={8} px={0}>
      <Flex h="30%" justify="space-evenly">
        <UserStats
          data={headers[0]}
          icon={AiOutlineUser}
          onClick={setSelectedTable}
        />
        <UserStats
          data={headers[1]}
          icon={IoMdMusicalNote}
          onClick={setSelectedTable}
        />
        <UserStats
          data={headers[2]}
          icon={MdAlbum}
          onClick={setSelectedTable}
        />
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
        {selectedTable && selectedTable == "Users" ? (
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
                        onClick={onUserOpen}
                        onMouseOver={(e) => setSelectedUser(data.id)}
                      >
                        BAN
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : selectedTable && selectedTable == "Songs" ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Owner</Th>
                <Th>Title</Th>
                <Th>Album</Th>
                <Th>Duration</Th>
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {songs &&
                songs.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.ownerName}</Td>
                    <Td>{data.title}</Td>
                    <Td>{data.albumName}</Td>
                    <Td>{durationToTime(data.duration)}</Td>
                    <Td isNumeric>
                      <Button
                        _hover={{ bg: "red.600" }}
                        bg="blue.700"
                        color="whiteAlpha.900"
                        onClick={onSongOpen}
                        onMouseOver={(e) =>
                          setSelectedSong({ id: data.id, title: data.title })
                        }
                      >
                        DELETE
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : selectedTable && selectedTable == "Albums" ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Owner</Th>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Release Date</Th>{" "}
              </Tr>
            </Thead>
            <Tbody>
              {albums &&
                albums.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.ownerName}</Td>
                    <Td>{data.title}</Td>
                    <Td>{data.description ? data.description : "empty"}</Td>
                    <Td>{data.releaseDate}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          ""
        )}
      </Box>

      {/* BAN USER MODAL */}
      <Modal isOpen={isUserOpen} onClose={onUserClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmitUserDelete}>
          <ModalContent>
            <ModalHeader>Ban User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to ban {"user's name"} for xxx days?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button bg="red.500" mr={3} type="submit" onClick={onUserClose}>
                Yes
              </Button>
              <Button colorScheme="blue" onClick={onUserClose}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* DELETE MUSIC  MODAL */}
      <Modal isOpen={isSongOpen} onClose={onSongClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmitSongDelete}>
          <ModalContent>
            <ModalHeader>Delete Music</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to delete "{selectedSong.title}" ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button bg="red.500" mr={3} type="submit" onClick={onSongClose}>
                Yes
              </Button>
              <Button colorScheme="blue" onClick={onSongClose}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default AdminPage;
