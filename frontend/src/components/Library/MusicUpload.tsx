import { Box, Button, Input, Text, InputGroup, Select } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import LibrarySection from "./LibrarySection";
import { Album } from "@/types";

type Props = {
  albums: Album[],
}

const MusicUpload: React.FC<Props> = () => {
  const [uploadForm, setUploadForm] = useState({
    name: '',
    artist: [] as string[],
    album: '',
    genre: '',
    imageUrl: '',
    file: null as File | null,
  });

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
    <Box mt={4} px={4}>
      <form>
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

        <InputGroup>
          <Input
            type="text"
            placeholder="Song name"
            value={uploadForm.name}
            onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
          />
          <Input
            ml={2}
            type="text"
            placeholder="Album name"
            value={uploadForm.album}
            onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
          />
        </InputGroup>
        <Input
          type="text"
          placeholder="Artist 1, Artist 2, ..."
          value={uploadForm.artist}
          onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value.split(',').map(s => s.trim()) })}
        />
        <Select placeholder="--- select genre ---">
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="jazz">Jazz</option>
        </Select>

        <Button
          width="100%"
          borderRadius={16}
          mt={1}
          type="submit"
        >
          Upload
        </Button>
      </form>
    </Box>
  );
}

export default MusicUpload;