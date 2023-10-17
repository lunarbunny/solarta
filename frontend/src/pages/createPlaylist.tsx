import Auth from "@/components/Auth/Auth";
import { auth } from "@/firebase/clientApp";
import {
  Box,
  Center,
  CircularProgress,
  ButtonGroup,
  IconButton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  useColorModeValue,
  Input,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { NextPage } from "next";
import SearchBar from "@/components/Search/SearchBar";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { MdEdit } from "react-icons/md";
import { useAuthState } from "react-firebase-hooks/auth";

const createPlayListPage: NextPage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <Center w="100%">
        <CircularProgress isIndeterminate color="blue.700" />
      </Center>
    );
  }

  if (!user) {
    return <Auth />;
  }

  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return isEditing ? (
      <ButtonGroup mx="20px" size="sm" w="50%  " spacing={2}>
        <IconButton
          aria-label="confirm playlist title"
          icon={<CheckIcon />}
          colorScheme="blue"
          variant="solid"
          isRound={true}
          fontSize="13px"
          size="sm"
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="cancel playlist title"
          icon={<CloseIcon boxSize={3} />}
          colorScheme="red"
          variant="solid"
          isRound={true}
          fontSize="13px"
          size="sm"
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : null;
  }

  return (
    <Flex w="100%" justify="center">
      <Box my="15px" borderRadius="5px" bg="blue.100" w="70%">
        <Editable
          px="5px"
          pt="50px"
          fontSize="50px"
          size="lg"
          defaultValue="Rasengan ⚡️"
          isPreviewFocusable={true}
          selectAllOnFocus={false}
        >
          <Tooltip label="Click to edit" shouldWrapChildren={true}>
            <EditablePreview
              px={4}
              _hover={{
                background: useColorModeValue("gray.100", "gray.700"),
              }}
            />
          </Tooltip>
          <Flex direction="row">
            <Input px={4} as={EditableInput} />
            <EditableControls />
          </Flex>
        </Editable>
        <SearchBar />
      </Box>
    </Flex>
  );
};

export default createPlayListPage;
