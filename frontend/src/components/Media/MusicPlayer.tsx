import { musicPlayerAtom } from "@/atoms/musicPlayer";
import {
  Box,
  Flex,
  Icon,
  IconButton,
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
import { useEffect, useRef } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { MdDelete } from "react-icons/md";
import { PiPlaylist } from "react-icons/pi";
import { useRecoilState } from "recoil";

const MusicPlayer = () => {
  const [state, setState] = useRecoilState(musicPlayerAtom);

  const playerRef = useRef<AudioPlayer>(null);

  if (state.playlist.length == 0) {
    return <></>;
  }

  const handleClickNextPrev = (isNext: boolean) => {
    let newIndex = state.currentTrack + (isNext ? 1 : -1);
    if (newIndex < 0) {
      newIndex = state.playlist.length - 1;
    } else if (newIndex >= state.playlist.length) {
      newIndex = 0;
    }
    setState({ ...state, currentTrack: newIndex });
  };

  const handleEnd = () => {
    // Wrap around to the beginning
    setState({ ...state, currentTrack: 0 });
  };

  const handleError = () => {
    console.log("No music played");
  };

  const removeTrack = (title: string) => {
    setState({
      ...state,
      playlist: state.playlist.filter((item) => item.title !== title),
      currentTrack:
        state.currentTrack < state.playlist.length - 1 ? state.currentTrack : 0,
    });
  };

  return (
    <AudioPlayer
      ref={playerRef}
      layout="stacked-reverse"
      showSkipControls
      showJumpControls={false}
      onClickPrevious={() => handleClickNextPrev(false)}
      onClickNext={() => handleClickNextPrev(true)}
      src={
        state.playlist.length > 0 ? state.playlist[state.currentTrack].src : ""
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
        <Flex key={1} w="auto" direction="row" align="center">
          {state.playlist.length > 0 ? (
            <Image
              alt="cover"
              boxSize="64px"
              borderRadius="full"
              borderColor="#040b24"
              border="2px"
              objectFit="cover"
              src={state.playlist[state.currentTrack].imageUrl}
            />
          ) : (
            ""
          )}

          <Flex key={2} mx="5px" direction="column">
            <Text color="whiteAlpha.800" my="5px" fontSize="lg">
              {state.playlist.length > 0
                ? state.playlist[state.currentTrack].title
                : ""}
            </Text>
            <Text color="whiteAlpha.800" fontSize="md">
              {state.playlist.length > 0
                ? state.playlist[state.currentTrack].artist
                : ""}
            </Text>
          </Flex>
        </Flex>,
      ]}
      customVolumeControls={[
        <Popover strategy="fixed" key={3}>
          <PopoverTrigger>
            <span>
              <Icon mx="10px" as={PiPlaylist} boxSize="30px" color="#72c2e7" />
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>
              <Text fontSize="xl">Queue</Text>
            </PopoverHeader>
            <PopoverBody>
              {state.playlist.map((song, idx) => (
                <Box
                  key={idx}
                  my="5px"
                  px="5px"
                  borderRadius="5px"
                  bg={state.currentTrack == idx ? "blue.500" : "blue.700"}
                >
                  <Flex direction="row" align="center">
                    <Flex
                      flexGrow={1}
                      py={2}
                      direction="column"
                      color={
                        state.currentTrack == idx ? "white" : "whiteAlpha.800"
                      }
                    >
                      <Text fontWeight="bold">{song.title}</Text>
                      <Text>{song.artist}</Text>
                    </Flex>

                    <IconButton
                      aria-label="Remove track"
                      icon={<MdDelete />}
                      size="sm"
                      colorScheme="red"
                      isRound={true}
                      onClick={(e) => removeTrack(song.title)}
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
