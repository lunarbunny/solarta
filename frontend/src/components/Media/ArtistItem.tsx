import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { Artist } from '../../types';

type Props = {
    data: Artist;
};

const ArtistItem: React.FC<Props> = ({ data }) => {
    return (
        <Box textAlign="center">
            <Image borderRadius='full'
                src={'https://picsum.photos/512?random=' + data.id}
            />
            <Box paddingTop={3}>
                <Text fontWeight="semibold">{data.name}
                </Text>
                <Text color="gray.400" letterSpacing="2px">
                    ARTIST
                </Text>
            </Box>
        </Box>
    );
};

export default ArtistItem;
