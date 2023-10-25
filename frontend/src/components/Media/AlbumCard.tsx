import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Album } from "../../types";
import { dateToYear } from "@/utils";

type Props = {
  data: Album;
  onClick?: (album: Album) => void;
};

const AlbumCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <Flex
      h="100%"
      direction="column"
      maxW="150px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      onClick={(_) => onClick}
      _hover={{ opacity: "0.7" }}
    >
      <Image
        src={data.imageUrl || "https://picsum.photos/512?random=" + data.id}
        alt={data.title}
      />
      <Flex p={4} direction="column" flexGrow={1}>
        <Text fontSize="sm" fontWeight="semibold" flexGrow={1}>
          {data.title}
        </Text>
        <Text fontSize="sm" mt={2} color="gray.600">
          {dateToYear(data.releaseDate)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default AlbumCard;
