import { Flex, IconButton, HStack, Text, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Container, Box } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight, FaVolumeHigh } from "react-icons/fa6";

type MusicPlayerProps = {
  name: string,
  artist: string,
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ name, artist }) => {
  const [volume, setVolume] = useState(70);
  const [seekbar, setSeekbar] = useState(0); // Seconds since start of music

  const handleVolumeChange = (v: number) => {
    setVolume(v);
  }

  const handleSeekbarChange = (s: number) => {
    setSeekbar(s);
  }

  return (
    <Box w="100%" bgGradient="linear(to-l, blue.700, blue.900)" px={8} py={4}>
      <Flex direction="column">
        {/* Name, artist, play/next/prev, volume buttons */}
        <Flex justifyContent="space-between" >
          <Flex direction="column" w="30%">
            <Text>{name}</Text>
            <Text>{artist}</Text>
          </Flex>

          <HStack spacing={2}>
            <IconButton isRound aria-label={"Prev"} icon={<FaChevronLeft />} />
            <IconButton isRound aria-label={"Play"} icon={<FaPlay />} />
            <IconButton isRound aria-label={"Next"} icon={<FaChevronRight />} />
          </HStack>

          <HStack w="30%">
            <FaVolumeHigh />
            <Slider aria-label='slider-volume' min={0} max={100} value={volume} onChange={handleVolumeChange}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </HStack>
        </Flex>

        {/* Seek bar */}
        <Slider
          aria-label='slider-seekbar'
          value={seekbar} onChange={handleSeekbarChange}
          mt={2} mx={1}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Flex>
    </Box>
  );
};

export default MusicPlayer;