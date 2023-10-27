import {
  Box,
  Heading,
  Skeleton,
  Grid,
  GridItem,
  Flex,
  Text,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { Artist } from "../../types";
import { IconType } from "react-icons";

type Props = {
  data: {
    metric: string;
    value: number;
  };
  icon: IconType;
};

const UserStats: React.FC<Props> = ({ data, icon }) => {
  return (
    <Flex
      my={10}
      py="50px"
      bg="whiteAlpha.400"
      align="center"
      direction="row"
      justify="start"
      w="20%"
      borderRadius="2xl"
    >
      <Icon
        borderRadius="full"
        bg="orange.500"
        boxSize="80px"
        as={icon}
        mx={3}
        ml={10}
      />
      <Flex direction="column">
        <Text fontSize="4xl" as="b">
          {data.value}
        </Text>
        <Text fontSize="md">{data.metric}</Text>
      </Flex>
    </Flex>
  );
};

export default UserStats;
