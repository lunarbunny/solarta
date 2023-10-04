import { Box, Text } from '@chakra-ui/react'

interface Props {
  title: string,
  children: React.ReactNode
}

const SidebarGroup = ({ title, children }: Props) => {
  return (
    <Box px={5} py={4}>
      <Text fontWeight="bold" fontSize="lg" mb={2}>
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default SidebarGroup;