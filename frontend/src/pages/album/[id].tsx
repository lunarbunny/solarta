import MusicList from "@/components/Media/MusicList";
import useFetch from "@/hooks/useFetch";
import { Album, API_URL, Music } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { NextPage } from "next";
import { useRouter } from "next/router";
import { MdLocalShipping } from 'react-icons/md';

// Accessed via /album/[id]
const AlbumDetailPage: NextPage = () => {
  const router = useRouter();
  const { data: album } = useFetch<Album>(`${API_URL}/album/${router.query.id}`, true);
  const { data: albumMusic } = useFetch<Music[]>(`${API_URL}/album/${router.query.id}/music`, true);

  if (!album) {
    return <CircularProgress isIndeterminate color='white.500' />;
  }

  console.log(album);

  return (
    // <Flex direction='row'>
    //   <AlbumCard data={album} />
    //   <MusicList items={albumMusic} />
    // </Flex>
    <Box w='100%' maxW={'7xl'}>
      <Image
        alt={'product image'}
        src={`https://picsum.photos/720?random=${router.query.id}`}
        fit={'cover'}
        align={'center'}
        w={'100%'}
        h={{ base: '100%', sm: '400px', lg: '500px' }}
      />

      <Box p={8}>
        <Box as={'header'}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
            {album.title}
          </Heading>
          <Text
            color='gray.400'
            fontWeight={300}
            fontSize={'2xl'}>
            {album.ownerName}
          </Text>
        </Box>

        <Text>
          {album.description && album.description}
        </Text>

        <Divider my={4} />

        <MusicList items={albumMusic} />
      </Box>
    </Box>
  );
};

export default AlbumDetailPage;