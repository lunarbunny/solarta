import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Artist } from "../../types";

type Props = {
  data: Artist;
  onClick?: (album: Artist) => void;
};

const ArtistCard: React.FC<Props> = ({ data, onClick }) => {
  return (
    <Box
      h="100%"
      textAlign="center"
      maxW="150px"
      onClick={(_) => onClick}
      _hover={{ opacity: "0.7" }}
    >
      <Image
        alt="artist image"
        borderRadius="full"
        src={"https://picsum.photos/512?random=" + data.id}
      />
      <Box paddingTop={3}>
        <Text fontSize="md" fontWeight="bold" noOfLines={2}>
          {data.name}
        </Text>
      </Box>
    </Box>
  );
};

export default ArtistCard;
