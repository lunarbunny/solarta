import { Box, Flex, Heading } from "@chakra-ui/react";

interface Props {
  title: string,
  children: React.ReactNode
}

const LibrarySection: React.FC<Props> = ({ title, children }) => {
  return (
    <Box bg={'gray.800'} py={4}>
      <Heading size='sm' textAlign='center'>{title}</Heading>
      <Flex alignItems='center'>
        <Box flexGrow={1} >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}

export default LibrarySection;