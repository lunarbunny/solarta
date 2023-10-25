import { Box, Center, Icon, SimpleGrid, Wrap } from "@chakra-ui/react";
import React from "react";
import { Album } from "../../types";
import AlbumCard from "./AlbumCard";
import { FiPlus, FiPlusCircle } from "react-icons/fi";
import Link from "next/link";

type Props = {
  items: Album[] | null;
  clickable?: boolean;
  onCreateClick?: () => void;
};

const AlbumWrap: React.FC<Props> = ({
  items: albums,
  clickable,
  onCreateClick,
}) => {
  return (
    <Wrap spacing={4}>
      {albums &&
        albums.map((album, index) =>
          clickable ? (
            <Link key={index} href={`/album/${album.id}`}>
              <AlbumCard data={album} />
            </Link>
          ) : (
            <Box key={index}>
              <AlbumCard data={album} />
            </Box>
          )
        )}
      {onCreateClick && (
        <Box
          onClick={onCreateClick}
          w="150px"
          minH="235px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          cursor="pointer"
        >
          <Center h="100%">
            <Icon as={FiPlus} w={8} h={8} />
          </Center>
        </Box>
      )}
    </Wrap>
  );
};

export default AlbumWrap;
