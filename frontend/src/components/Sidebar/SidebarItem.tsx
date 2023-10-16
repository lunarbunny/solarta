import { Flex } from '@chakra-ui/react'

interface Props {
  name: string,
  icon: React.ReactNode
}

const SidebarItem = ({ name, icon }: Props) => {
  return (
    <Flex alignItems="center" color="white" _hover={{ color: "gray.400" }} my={2}>
      {icon}
      <Flex ml={2} mb="-4px" fontSize="md" color="gray.200">
        {name}
      </Flex>
    </Flex>
  )
}

export default SidebarItem;