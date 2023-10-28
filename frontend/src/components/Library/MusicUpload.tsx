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
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { API_URL, Album, Genre, Music } from "@/types";
import useFetch from "@/hooks/useFetch";
import { dateToYear } from "@/utils";

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
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    title: "",
    albumId: "",
    genreId: "",
    music_file: null as File | null,
  });

  // Fetch albums and genres to populate the dropdowns
  const { data: genres } = useFetch<Genre[]>(`${API_URL}/genre`);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("genreId", uploadForm.genreId);
    formData.append("albumId", uploadForm.albumId);
    formData.append("music_file", uploadForm.music_file as File);

    const response = await fetch(`${API_URL}/music/create`, {
      method: "POST",
      body: formData,
      credentials: 'include',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.log(response);
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
          borderColor="gray.300"
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
          <FormControl>
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
            <FormControl>
              <FormLabel>Artist</FormLabel>
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
            <FormControl ms={4}>
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

          <Button mt={4} colorScheme="blue" type="submit">
            Upload
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default MusicUpload;
