import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Music } from "../../types";
import { FiHeart, FiTrash } from "react-icons/fi";
import { durationToTime } from "@/utils";

type Props = {
  data: Music;
  onClick?: (m: Music) => void | undefined;
};

const MusicItem: React.FC<Props> = ({ data, onClick }) => {
  return (
    <Flex
      px={2} py={1}
      alignItems="center"
      _hover={{ bg: "blue.700" }}
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick && (() => onClick(data))}
    >
      <Image
        alt="cover"
        boxSize="42px"
        borderRadius="full"
        src={data.imageUrl || "https://picsum.photos/42?random=" + data.id}
      />
      <Box flexGrow={1} ml={3}>
        <Text fontWeight="semibold" noOfLines={1}>{data.title}</Text>
        <Text fontSize="sm" color="gray.500">
          {data.ownerName || "Unknown artist"}
        </Text>
      </Box>
      <Text fontSize="sm" me={2}>
        {data.duration ? durationToTime(data.duration) : "No duration"}
      </Text>
      <FiHeart color="gray" />
    </Flex>
  );
};

export default MusicItem;
