import { Flex, IconButton, HStack, Text, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Container, Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay, FaChevronLeft, FaChevronRight, FaVolumeHigh } from "react-icons/fa6";

type MusicPlayerProps = {
  name: string,
  artist: string,
  durationSec: number,
}

const secondsToMinSec = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ name, artist, durationSec }) => {
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0); // Seconds since start of music

  const handleVolumeChange = (v: number) => {
    setVolume(v);
  }

  const handleSeekbarChange = (s: number) => {
    setDuration(s);
  }

  return (
    <Box
      w="100%"
      bgGradient="linear(to-l, blue.700, blue.900)"
      px={8} py={4}>
      {/* Name, artist, play/next/prev, volume buttons */}
      <Flex justifyContent="space-between" >
        <Flex direction="column" w="30%">
          <Text
            fontSize="lg"
            fontWeight="bold"
            noOfLines={2}>
            {name}
          </Text>
          <Text
            fontSize="sm"
            color="gray.400" >
            {artist}
          </Text>
        </Flex>

        <VStack flexGrow={1} px={4}>
          {/* Media control buttons */}
          <HStack spacing={2}>
            <IconButton isRound aria-label={"Prev"} icon={<FaChevronLeft />} />
            <IconButton isRound aria-label={"Play"} icon={<FaPlay />} />
            <IconButton isRound aria-label={"Next"} icon={<FaChevronRight />} />
          </HStack>
          {/* Seek bar */}
          <Text fontSize="sm" color="gray.400">
            {secondsToMinSec(duration)} / {secondsToMinSec(durationSec)}
          </Text>
          <Slider
            aria-label='slider-seekbar'
            mt={-2}
            min={0} max={durationSec}
            value={duration} onChange={handleSeekbarChange}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </VStack>

        <HStack w="30%" px={4}>
          <FaVolumeHigh />
          <Slider aria-label='slider-volume' min={0} max={100} value={volume} onChange={handleVolumeChange}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
      </Flex>
    </Box>
  );
};

export default MusicPlayer;