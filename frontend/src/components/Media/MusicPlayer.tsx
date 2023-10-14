import { useState, useRef, useEffect } from "react";
import { NextPage } from "next";
import {
  Flex,
  Text,
  Box,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Image,
  Icon,
} from "@chakra-ui/react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { PiListNumbersDuotone } from "react-icons/pi";
import { MdDelete } from "react-icons/md";

const MusicPlayer = () => {
  interface IPlaylist {
    src: string;
    title: string;
    artist: string;
    cover: string;
  }

  const playlist: IPlaylist[] = [
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      title: "SoundHelix-Song-5",
      artist: "nobody",
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      title: "SoundHelix-Song-9",
      artist: "somebody",
      cover: "https://bit.ly/dan-abramov",
    },
    {
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      title: "SoundHelix-Song-2",
      artist: "anybody",
      cover: "https://bit.ly/dan-abramov",
    },
  ];

  const [playListState, setPlaylist] = useState<IPlaylist[]>(playlist);

  const [currentTrack, setTrackIndex] = useState(0);

  // useEffect(() => {
  //   const currentTrackName = playListState[currentTrack].title;
  //   setPlaylist(
  //     playListState.filter((item) => item.title !== currentTrackName)
  //   );
  // }, [currentTrack]);

  const handleClickNext = () => {
    setTrackIndex((currentTrack) =>
      currentTrack < playListState.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleEnd = () => {
    console.log("end");
    setTrackIndex((currentTrack) =>
      currentTrack < playListState.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleError = () => {
    console.log("No music played");
  };

  const removeTrack = (title: string) => {
    return (event: React.MouseEvent) => {
      setPlaylist(playListState.filter((item) => item.title !== title));
    };
  };

  return (
    <AudioPlayer
      layout="stacked-reverse"
      showSkipControls
      volume={0.1}
      onClickNext={handleClickNext}
      src={
        playListState[currentTrack].src ? playListState[currentTrack].src : ""
      }
      onError={handleError}
      onPlayError={handleError}
      onEnded={handleEnd}
      customProgressBarSection={[
        RHAP_UI.CURRENT_TIME,
        RHAP_UI.PROGRESS_BAR,
        RHAP_UI.CURRENT_LEFT_TIME,
      ]}
      customAdditionalControls={[
        <Flex w="auto" direction="row" align="center">
          <Image
            boxSize="75px"
            borderRadius="4px"
            borderColor="#040b24"
            border="2px"
            objectFit="cover"
            src={playListState[currentTrack].cover}
          />
          <Flex mx="5px" direction="column">
            <Text my="5px" fontSize="lg">
              {playListState[currentTrack].title}
            </Text>
            <Text fontSize="md">{playListState[currentTrack].artist}</Text>
          </Flex>
        </Flex>,
      ]}
      customVolumeControls={[
        <Popover>
          <PopoverTrigger>
            <span>
              <Icon
                mx="10px"
                as={PiListNumbersDuotone}
                boxSize="30px"
                color="blue.700"
              />
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Text fontSize="xl">Queue</Text>
            </PopoverHeader>
            <PopoverBody h="200%" w="100%">
              {playListState.map((song, key) => (
                <Box
                  key={key}
                  my="5px"
                  px="5px"
                  bg={
                    playListState[currentTrack].title == song.title
                      ? "blue.400"
                      : "whiteAlpha.800"
                  }
                  borderRadius="5px"
                >
                  <Flex direction="row" justify="space-between">
                    <Flex
                      color={
                        playListState[currentTrack].title == song.title
                          ? "whiteAlpha.800"
                          : "blackAlpha.800"
                      }
                      py={2}
                      direction="column"
                    >
                      <Text fontSize="xl">{song.title}</Text>
                      <Text fontSize="lg">{song.artist}</Text>
                    </Flex>
                    <Icon
                      as={MdDelete}
                      mt="10px"
                      boxSize="30px"
                      color="red.700"
                      onClick={removeTrack(song.title)}
                    />
                  </Flex>
                </Box>
              ))}
            </PopoverBody>
          </PopoverContent>
        </Popover>,
        RHAP_UI.VOLUME,
      ]}
    />
  );
};

export default MusicPlayer;
