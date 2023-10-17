import { Box, Button, Input, Text, Select, InputGroup, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { API_URL, Album, Genre } from "@/types";
import useFetch from "@/hooks/useFetch";
import { dateToYear } from "@/utils";

type Props = {
  albums: Album[],
}

const MusicUpload: React.FC<Props> = () => {
  const [uploadForm, setUploadForm] = useState({
    name: '',
    artist: [] as string[],
    albumId: '',
    genreId: '',
    imageUrl: '',
    file: null as File | null,
  });

  // Fetch albums and genres to populate the dropdowns
  const { data: genres } = useFetch<Genre[]>(`${API_URL}/genre`);
  const { data: albums } = useFetch<Album[]>(`${API_URL}/album`);

  // Dropzone for music file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length == 1) {
      setUploadForm({ ...uploadForm, file: acceptedFiles[0] });
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { allow: ['.mp3'] },
    maxFiles: 1,
  });

  return (
    <form>
      <Flex>
        <Box {...getRootProps()}
          height="auto" minHeight="80px" p={4}
          border="2px dashed" borderColor="gray.300" borderRadius="md"
          display="flex" flexDirection="column" alignItems="center" justifyContent="center"
          cursor="pointer">
          <input {...getInputProps()} />
          {
            uploadForm.file
              ? <Text>{uploadForm.file.name}</Text>
              : <Text>{isDragActive ? 'Drop the music file here ...' : 'Drop your music file here'}</Text>
          }
        </Box>

        <Flex flexGrow={1} ms={4} direction="column" align="flex-end">
          <FormControl>
            <FormLabel>Song name</FormLabel>
            <Input type="text" value={uploadForm.name}
              onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
            />
          </FormControl>

          <InputGroup mt={2} >
            <FormControl>
              <FormLabel>Artist</FormLabel>
              <Select value={uploadForm.albumId} onChange={(e) => setUploadForm({ ...uploadForm, albumId: e.target.value })}>
                <option value="none">--- select album ---</option>
                {albums && albums.map((album, idx) => (
                  <option key={idx} value={album.id}>{album.title} ({dateToYear(album.releaseDate)})</option>
                ))}
              </Select>
            </FormControl>
            <FormControl ms={4}>
              <FormLabel>Genre</FormLabel>
              <Select value={uploadForm.genreId} onChange={(e) => setUploadForm({ ...uploadForm, genreId: e.target.value })}>
                <option value="none">--- select genre ---</option>
                {genres && genres.map((genre, idx) => (
                  <option key={idx} value={genre.id}>{genre.name}</option>
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
}

export default MusicUpload;