import {
  Box,
  Button,
  Input,
  Text,
  Select,
  InputGroup,
  Flex,
  FormControl,
  FormLabel,
  Modal,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { API_URL, Album, Genre, Music } from "@/types";
import useFetch from "@/hooks/useFetch";
import { dateToYear, postWithCsrfToken, validateName } from "@/utils";
import { useRouter } from "next/router";

type Props = {
  albums: Album[];
};

type UploadFormData = {
  title: string;
  genreId: string;
  albumId: string;
  music_file: File | null;
};

const MusicUpload: React.FC<Props> = ({ albums }) => {
  const router = useRouter();
  const { uploadToAlbum } = router.query;

  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    title: "",
    albumId: "",
    genreId: "",
    music_file: null as File | null,
  });

  // Fetch albums and genres to populate the dropdowns
  const { data: genres } = useFetch<Genre[]>(`${API_URL}/genre`);

  const [error, setError] = useState('');
  const [songnameHasError, setSongnameHasError] = useState(false);
  const [albumIdHasError, setAlbumIdHasError] = useState(false);
  const [genreIdHasError, setGenreIdHasError] = useState(false);
  const [musicFileHasError, setMusicFileHasError] = useState(false);

  // Dropzone for music file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length == 1) {
      setUploadForm({ ...uploadForm, music_file: acceptedFiles[0] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [".mp3"] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (router.isReady && uploadToAlbum) {
      setUploadForm({ ...uploadForm, albumId: uploadToAlbum as string });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadToAlbum]);

  useEffect(() => {
    // Check file size <= 10MB
    const sizeLimit = 10 * 1024 * 1024;
    if (uploadForm.music_file && uploadForm.music_file.size > sizeLimit) {
      alert("Error: Music file size must be less than 10MB.");
      setUploadForm(old => ({ ...old, music_file: null }));
    }
  }, [uploadForm.music_file]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    if (error) setError('');
    if (songnameHasError) setSongnameHasError(false);
    if (albumIdHasError) setAlbumIdHasError(false);
    if (genreIdHasError) setGenreIdHasError(false);
    if (musicFileHasError) setMusicFileHasError(false);

    // Validations
    if (!validateName(uploadForm.title)) {
      setError('Please enter a song name that is 3-64 chars long.');
      setSongnameHasError(true);
      return;
    }

    if (uploadForm.albumId == "none") {
      setError('Please select an album.');
      setAlbumIdHasError(true);
      return;
    }

    if (uploadForm.genreId == "none") {
      setError('Please select a genre.');
      setGenreIdHasError(true);
      return;
    }

    if (!uploadForm.music_file) {
      setError('Please choose a music file to upload.');
      setMusicFileHasError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("genreId", uploadForm.genreId);
    formData.append("albumId", uploadForm.albumId);
    formData.append("music_file", uploadForm.music_file as File);

    const res = await postWithCsrfToken(`${API_URL}/music/create`, formData);

    if (res.ok) {
      router.push(`/album/${uploadForm.albumId}`);
    } else {
      let resText = await res.text();
      alert("Error: Could not upload music. Reason: " + resText);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        <Box
          {...getRootProps()}
          w="30%"
          p={4}
          border="2px dashed"
          borderColor={musicFileHasError ? "red.300" : "gray.300"}
          borderRadius="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
          <input {...getInputProps()} />
          {uploadForm.music_file ? (
            <Text>{uploadForm.music_file.name}</Text>
          ) : (
            <Text>
              {isDragActive
                ? "Drop the music file here ..."
                : "Drop your music file here"}
            </Text>
          )}
        </Box>

        <Flex flexGrow={1} ms={4} direction="column" align="flex-end">
          <FormControl isInvalid={songnameHasError}>
            <FormLabel>Song name</FormLabel>
            <Input
              type="text"
              value={uploadForm.title}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, title: e.target.value })
              }
            />
          </FormControl>

          <InputGroup mt={2}>
            <FormControl isInvalid={albumIdHasError}>
              <FormLabel>Album</FormLabel>
              <Select
                value={uploadForm.albumId}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, albumId: e.target.value })
                }
              >
                <option value="none">--- select album ---</option>
                {albums &&
                  albums.map((album, idx) => (
                    <option key={idx} value={album.id}>
                      {album.title} ({dateToYear(album.releaseDate)})
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl ms={4} isInvalid={genreIdHasError}>
              <FormLabel>Genre</FormLabel>
              <Select
                value={uploadForm.genreId}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, genreId: e.target.value })
                }
              >
                <option value="none">--- select genre ---</option>
                {genres &&
                  genres.map((genre, idx) => (
                    <option key={idx} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </InputGroup>

          <Flex direction="row" align="center" mt={4} w="100%" >
            <Text fontSize="12pt" color="red.300" flexGrow={1}>
              {error}
            </Text>

            <Button colorScheme="blue" type="submit">
              Upload
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
};

export default MusicUpload;
