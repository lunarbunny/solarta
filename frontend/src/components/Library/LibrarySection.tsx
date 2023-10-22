import { Box, Flex, Heading } from "@chakra-ui/react";

interface Props {
  title: string,
  children: React.ReactNode
}

const LibrarySection: React.FC<Props> = ({ title, children }) => {
  return (
    <Box bg={'gray.800'} py={4} borderRadius='8px'>
      <Heading size='sm' textAlign='center'>{title}</Heading>
      <Box mt={4} px={4} >
        {children}
      </Box>
    </Box>
  );
}

export default LibrarySection;