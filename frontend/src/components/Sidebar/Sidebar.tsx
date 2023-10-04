import { Box, Flex, Link, Text, Image } from '@chakra-ui/react'
import Playlists from './Playlists'
import { TbAlbum, TbMusic } from 'react-icons/tb'
import { FiUpload, FiUsers } from 'react-icons/fi'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'

const pages = [
  { name: 'Songs', icon: <TbMusic size={20} /> },
  { name: 'Artists', icon: <FiUsers size={20} /> },
  { name: 'Albums', icon: <TbAlbum size={20} /> },
  { name: 'Upload', icon: <FiUpload size={20} /> },
]

const Sidebar = () => {
  return (
    <Box minW="250px" h="100%" bgGradient="linear(to-l, blue.700, blue.900)">
      <Flex alignItems="center" justifyContent="space-between" px={5} py={4}>
        <Link href="/" display="flex" alignItems="center" color="white" _hover={{ textDecoration: "none" }}>
          <Image src="/favicon.ico" height="24px" />
          <Text ml={2} fontWeight="bold" fontSize="lg">
            Solarta
          </Text>
        </Link>
      </Flex>

      <SidebarGroup title="DISCOVER">
        <>
          {
            pages.map((page) => (
              <SidebarItem name={page.name} icon={page.icon} />
            ))
          }
        </>
      </SidebarGroup>

      <SidebarGroup title="PLAYLISTS">
        <Playlists />
      </SidebarGroup>
    </Box>
  )
}

export default Sidebar;