import { Flex } from '@chakra-ui/react'

interface Props {
  name: string,
  icon: React.ReactNode,
  bolded?: boolean,
}

const SidebarItem = ({ name, icon, bolded }: Props) => {
  return (
    <Flex alignItems="center" color="white" _hover={{ color: "gray.400" }} my={2}>
      {icon}
      <Flex ml={2} mb="-4px" fontSize="md" color="gray.200" fontWeight={bolded ? "bold" : "normal"}>
        {name}
      </Flex>
    </Flex>
  )
}

export default SidebarItem;