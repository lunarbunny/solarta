import React from "react";
import { useRouter } from "next/router";
import { API_URL, Music } from "../../types";
import { Button, Flex, Image, Td, Text } from "@chakra-ui/react";
import { durationToTime } from "@/utils";

type Props = {
  data: Music;
  onClick?: (m: Music) => void | undefined;
  index: number;
};

const MusicTableRow: React.FC<Props> = ({ data, onClick, index }) => {
  const router = useRouter();

  const handleDeletePlaylistMusic = async () => {
    try {
      const response = await fetch(
        `${API_URL}/playlist/playlist=${router.query.id}/music=${data.id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.ok) {
        router.push("/");
        location.reload();
      }
    } catch (error) {
      console.error("Cannot delete music", error);
    }
  };

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
            <Text fontSize="md" fontWeight="semibold">
              {data.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {data.ownerName || "Unknown artist"}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>{data.albumName}</Td>
      <Td>{durationToTime(data.duration)}</Td>
      <Td>
        <Button onClick={handleDeletePlaylistMusic}>Remove</Button>
      </Td>
    </>
  );
};

export default MusicTableRow;
