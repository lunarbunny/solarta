import { Box, Button, Card, CardBody, CardHeader, Heading, Input, VStack, Text, InputGroup, InputLeftAddon, Flex, Select } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

const MusicUpload: React.FC = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    artist: [''],
    album: '',
    genre: '',
    image: '',
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
    <Card>
      <CardHeader>
        <Heading size='md'>Music Upload</Heading>
      </CardHeader>
      <CardBody>
        <form>
          <VStack spacing={2}>
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

            <Box {...getRootProps()}
              w="100%" height="100px"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer">
              <input {...getInputProps()} />
              {!uploadForm.file && <Text>{isDragActive ? 'Drop the music file here ...' : 'Drop your music file here'}</Text>}
              {uploadForm.file && <Text>{uploadForm.file.name}</Text>}
            </Box>

            <Button
              width="100%"
              borderRadius={16}
              mt={1}
              type="submit"
            >
              Upload
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}

export default MusicUpload;