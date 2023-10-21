import { Box, Text, Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";
import Link from "next/link";

interface Props {
  title: string;
  children: React.ReactNode;
  hasButton: boolean;
}

const SidebarGroup = ({ title, children, hasButton }: Props) => {
  return (
    <Box px={5} py={4}>
      <Flex justify="space-between">
        <Text fontWeight="bold" fontSize="lg" mb={2}>
          {title}
        </Text>
        {hasButton == true ? (
          <Tooltip label="Create playlist" shouldWrapChildren={true}>
            <Link href="/createPlaylist">
              <IconButton
                aria-label="create playlist"
                icon={<HiPlus />}
                colorScheme="blue"
                variant="solid"
                isRound={true}
                fontSize="13px"
                size="xs"
                _hover={{ transform: "scale(1.05)" }}
                _active={{
                  transform: "scale(1)",
                }}
              />
            </Link>
          </Tooltip>
        ) : (
          ""
        )}
      </Flex>
      {children}
    </Box>
  );
};

export default SidebarGroup;
