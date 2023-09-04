import { Box, Button, Card, CardBody, CardHeader, Heading, Input, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";

const MusicUpload: React.FC = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    artist: [''],
    album: '',
    genre: '',
    image: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      console.log(selectedFile);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size='md'>Music Upload</Heading>
      </CardHeader>
      <CardBody>
        <form>
          <VStack align="flex-end">
            <Input
              type="text"
              placeholder="Name of the song"
              value={uploadForm.name}
              onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Artist 1, Artist 2, ..."
              value={uploadForm.artist}
              onChange={(e) => setUploadForm({ ...uploadForm, artist: e.target.value.split(',') })}
            />
            <Input
              type="text"
              placeholder="Album name"
              value={uploadForm.album}
              onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Music genre"
              value={uploadForm.genre}
              onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
            />

            <Box>
              <Input
                type="file"
                ref={uploadInputRef}
                onChange={handleFileChange}
                display="none"
              />
              <Button onClick={() => uploadInputRef.current && uploadInputRef.current.click()} variant="outline">
                Upload
              </Button>
            </Box>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}

export default MusicUpload;