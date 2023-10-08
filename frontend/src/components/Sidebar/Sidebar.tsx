import { Box, Flex, Text, Image } from '@chakra-ui/react'
import Playlists from './Playlists'
import { TbAlbum, TbMusic } from 'react-icons/tb'
import { FiUpload, FiUsers } from 'react-icons/fi'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <Box minW="250px" h="100%" bgGradient="linear(to-l, blue.700, blue.900)">
      <Flex alignItems="center" justifyContent="space-between" px={5} py={4}>
        <Link href="/">
          <Flex alignItems="center" cursor="pointer">
            <Image src="/favicon.ico" height="24px" />
            <Text ml={2} fontWeight="bold" fontSize="lg">
              Solarta
            </Text>
          </Flex>
        </Link>
      </Flex>

      <SidebarGroup title="DISCOVER">
        <Link href="/">
          <SidebarItem name='Songs' icon={<TbMusic size={20} />} />
        </Link>
        <Link href="/artists">
          <SidebarItem name='Artists' icon={<FiUsers size={20} />} />
        </Link>
        <Link href="/albums">
          <SidebarItem name='Albums' icon={<TbAlbum size={20} />} />
        </Link>
        <Link href="/upload">
          <SidebarItem name='Upload' icon={<FiUpload size={20} />} />
        </Link>
      </SidebarGroup>

      <SidebarGroup title="PLAYLISTS">
        <Playlists />
      </SidebarGroup>
    </Box>
  )
}

export default Sidebar;