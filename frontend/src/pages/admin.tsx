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
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Tooltip,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import { MdAlbum } from "react-icons/md";
import UserStats from "../components/Admin/UserStats";
import { deleteWithCsrfToken, durationToTime, putWithCsrfToken } from "@/utils";
import { AiOutlineUser } from "react-icons/ai";
import { IoMdMusicalNote } from "react-icons/io";
import { SearchIcon } from "@chakra-ui/icons";
import { FiInfo } from "react-icons/fi";
import useAuth from "@/hooks/useAuth";
import router from "next/router";

const AdminPage: NextPage = () => {
  const { user, loading: userLoading } = useAuth();

  const [query, setQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState("Users");
  const [selectedUser, setSelectedUser] = useState({
    id: 0,
    ownerName: "",
  });
  const [selectedSong, setSelectedSong] = useState({
    id: 0,
    title: "",
  });
  const {
    isOpen: isUserBanOpen,
    onOpen: onUserBanOpen,
    onClose: onUserBanClose,
  } = useDisclosure();

  const {
    isOpen: isUserUnbanOpen,
    onOpen: onUserUnbanOpen,
    onClose: onUserUnbanClose,
  } = useDisclosure();

  const {
    isOpen: isSongOpen,
    onOpen: onSongOpen,
    onClose: onSongClose,
  } = useDisclosure();

  const { data: users } = useFetch<User[]>(`${API_URL}/user/full`, {
    includeCred: true,
  });
  const { data: searches } = useFetch<User[]>(
    `${API_URL}/user/search=${query}`,
    {
      includeCred: true,
    }
  );
  const { data: songs } = useFetch<Music[]>(`${API_URL}/music/`, {
    includeCred: true,
  });
  const { data: albums } = useFetch<Album[]>(`${API_URL}/album/`, {
    includeCred: true,
  });

  if (userLoading) {
    return <Center><CircularProgress isIndeterminate color="blue.300" /></Center>;
  } else if (!user || !user.admin) {
    router.push("/"); // redirect to home page if not authorized
    return <>Redirecting to home page...</>;
  }

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
      return "ACTIVE";
    } else if (status == 1) {
      return "BANNED";
    } else {
      return "NOT VERIFIED";
    }
  }

  const handleSubmitSongDelete = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const response = await deleteWithCsrfToken(`${API_URL}/music/delete/${selectedSong.id}`, null);
    if (response.ok) {
      location.reload();
    } else {
      // console.log(response);
    }
  };

  const handleSubmitUserBan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await putWithCsrfToken(`${API_URL}/user/${selectedUser.id}/ban`, null);
    if (response.ok) {
      // console.log(response);
      location.reload();
    } else {
      // console.log(response);
    }
  };

  const handleSubmitUserUnban = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await putWithCsrfToken(`${API_URL}/user/${selectedUser.id}/unban`, null);
    if (response.ok) {
      // console.log(response);
      location.reload();
    } else {
      // console.log(response);
    }
  };

  function renderUserRow(data: User, index: number) {
    return (
      <Tr key={index}>
        <Td>{data.name}</Td>
        <Td>{data.email}</Td>
        <Td>{data.about}</Td>
        <Td>{returnStatus(data.status as number)}</Td>
        <Td isNumeric>
          <Button
            _hover={{ bg: data.status === 0 ? "red.600" : "green.600" }}
            bg="blue.700"
            color="whiteAlpha.900"
            onClick={data.status === 0 ? onUserBanOpen : onUserUnbanOpen}
            onMouseOver={(e) =>
              setSelectedUser({
                id: data.id,
                ownerName: data.name,
              })
            }
          >
            {data.status === 0 ? "BAN" : "UNBAN"}
          </Button>
        </Td>
      </Tr>
    );
  }

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

      {selectedTable && selectedTable == "Users" && (
        <Flex alignItems="center">
          <InputGroup>
            <InputLeftElement>
              <Icon color="whiteAlpha.600" ml={3} as={SearchIcon} />
            </InputLeftElement>
            <Input
              ml={2}
              mr={2}
              w="20%"
              type="text"
              placeholder="Search for users"
              _placeholder={{ color: "gray.200" }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Tooltip
              label="Search for users by name only"
              aria-label="Admin search bar tooltip"
              shouldWrapChildren={true}
            >
              <Icon boxSize={7} as={FiInfo} mt={1.5} />
            </Tooltip>
          </InputGroup>
        </Flex>
      )}

      <Box
        my={5}
        h="65%"
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
              {query == ""
                ? users?.map((data, index) => renderUserRow(data, index))
                : searches?.map((data, index) => renderUserRow(data, index))}
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
      <Modal isOpen={isUserBanOpen} onClose={onUserBanClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmitUserBan}>
          <ModalContent>
            <ModalHeader>Ban User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to ban {selectedUser.ownerName} ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="red.500"
                mr={3}
                type="submit"
                onClick={onUserBanClose}
              >
                Yes
              </Button>
              <Button colorScheme="blue" onClick={onUserBanClose}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* UNBAN USER MODAL */}
      <Modal isOpen={isUserUnbanOpen} onClose={onUserUnbanClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmitUserUnban}>
          <ModalContent>
            <ModalHeader>Unban User</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Are you sure you want to Unban {selectedUser.ownerName} ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                bg="green.500"
                mr={3}
                type="submit"
                onClick={onUserUnbanClose}
              >
                Yes
              </Button>
              <Button colorScheme="blue" onClick={onUserUnbanClose}>
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
                Are you sure you want to delete {selectedSong.title} ?
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
