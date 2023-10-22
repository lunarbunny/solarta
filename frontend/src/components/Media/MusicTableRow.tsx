import { Flex, Image, Text, Td } from "@chakra-ui/react";
import React from "react";
import { Music } from "../../types";

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

const MusicTableRow: React.FC<Props> = ({ data, onClick, index }) => {
  return (
    <>
      <Td>{index + 1}</Td>
      <Td onClick={onClick && (() => onClick(data))}>
        <Flex direction="row">
          <Image
            boxSize="64px"
            src={data.imageUrl || "https://picsum.photos/42?random=" + data.id}
            mr={4}
            alt="cover"
          />
          <Flex justify="center" direction="column">
            <Text fontSize="md" fontWeight="semibold">{data.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {data.ownerName || "Unknown artist"}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>{data.albumName}</Td>
      <Td>{durationToTime(data.duration)}</Td>
    </>
  );
};

export default MusicTableRow;
