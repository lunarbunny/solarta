import { Box, Flex, Image, Text, Tr, Th, Td } from "@chakra-ui/react";
import React from "react";
import { Music } from "../../types";
import { FiHeart } from "react-icons/fi";
import { Value } from "sass";

type Props = {
  data: Music;
  onClick?: (m: Music) => void | undefined;
  index: number;
};

function durationToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

const MusicItem: React.FC<Props> = ({ data, onClick, index }) => {
  return (
    <Flex

      minW="300px"
      alignItems="center"
      px={2}
      py={1}
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
      <Box flex={1} ml={3} mr={3}>
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
