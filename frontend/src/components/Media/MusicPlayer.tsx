import { API_URL } from "@/types";
import {
  Box,
  Flex,
  Icon,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { MdDelete } from "react-icons/md";
import { PiListNumbersDuotone, PiPlaylist } from "react-icons/pi";

type PlaylistItem = {
  src: string;
  title: string;
  artist: string;
  cover: string;
}

const MusicPlayer = () => {
  const playlist: PlaylistItem[] = [
    {
      src: `${API_URL}/music/play/1`,
      title: "Yo!",
      artist: "Xandr",
      cover: "https://picsum.photos/64?random=1",
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

  const [playListState, setPlaylist] = useState<PlaylistItem[]>(playlist);
  const [currentTrack, setTrackIndex] = useState<number>(0);

  // useEffect(() => {
  //   const currentTrackName = playListState[currentTrack].title;
  //   setPlaylist(
  //     playListState.filter((item) => item.title !== currentTrackName)
  //   );
  // }, [currentTrack]);

  const handleClickNextPrev = (isNext: boolean) => {
    let newIndex = currentTrack + (isNext ? 1 : -1);
    if (newIndex < 0) {
      newIndex = playListState.length - 1;
    } else if (newIndex >= playListState.length) {
      newIndex = 0;
    }
    setTrackIndex(newIndex);
  };

  const handleEnd = () => {
    console.log("end");
    setTrackIndex(0);
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
      showJumpControls={false}
      onClickPrevious={() => handleClickNextPrev(false)}
      onClickNext={() => handleClickNextPrev(true)}
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
            boxSize="64px"
            borderRadius="full"
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
                as={PiPlaylist}
                boxSize="30px"
                color="#72c2e7"
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
                      ? "blue.500"
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
