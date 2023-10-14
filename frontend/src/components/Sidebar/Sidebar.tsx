import { Box, Flex, Text, Image } from '@chakra-ui/react'
import Playlists from './Playlists'
import { TbAlbum, TbMusic } from 'react-icons/tb'
import { FiUpload, FiUsers } from 'react-icons/fi'
import { IoLibraryOutline } from 'react-icons/io5'
import SidebarGroup from './SidebarGroup'
import SidebarItem from './SidebarItem'
import Link from 'next/link'
import { useState } from 'react'

const Sidebar = () => {
  const [page, setPage] = useState('');

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
        <Link href="/" onClick={() => setPage('home')}>
          <SidebarItem name='Songs' icon={<TbMusic size={20} />} />
        </Link>
        <Link href="/artists" onClick={() => setPage('artists')}>
          <SidebarItem name='Artists' icon={<FiUsers size={20} />} />
        </Link>
        <Link href="/albums" onClick={() => setPage('albums')}>
          <SidebarItem name='Albums' icon={<TbAlbum size={20} />} />
        </Link>
        <Link href="/library" onClick={() => setPage('library')}>
          <SidebarItem name='My Library' icon={<IoLibraryOutline size={20} />} />
        </Link>
      </SidebarGroup>

      <SidebarGroup title="PLAYLISTS">
        <Playlists />
      </SidebarGroup>
    </Box>
  )
}

export default Sidebar;