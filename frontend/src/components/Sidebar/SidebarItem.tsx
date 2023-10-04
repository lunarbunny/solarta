import { Flex, Text } from '@chakra-ui/react'

interface Props {
  name: string,
  icon: React.ReactNode
}

const SidebarItem = ({ name, icon }: Props) => {
  return (
    <Flex alignItems="center" color="white" _hover={{ color: "gray.400" }} my={2}>
      {icon}
      <Text ml={2} fontSize="md" color="gray.200">
        {name}
      </Text>
    </Flex>
  )
}

export default SidebarItem;