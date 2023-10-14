import { Box, Flex, Heading } from "@chakra-ui/react";

interface Props {
  title: string,
  children: React.ReactNode
}

const LibrarySection: React.FC<Props> = ({ title, children }) => {
  return (
    <Box bg={'gray.800'}>
      <Flex py={2} alignItems="center">
        <Heading p={8} size='sm'>{title}</Heading>
        <Box flexGrow={1} >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}

export default LibrarySection;