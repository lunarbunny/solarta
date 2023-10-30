import useFetch from "@/hooks/useFetch";
import MusicList from "../Media/MusicList";
import { Box } from "@chakra-ui/react";
import { Music, API_URL } from "@/types";

type Props = {
  query: string;
};

const SearchResults = ({ query }: Props) => {
  const { data, loading, error } = useFetch<Music[]>(`${API_URL}/music/search=${query}`);

  return (
    <>
      {query && (
        <Box
          position="absolute"
          w="50%"
          top="5%"
          background="rgba(5, 14, 150, 0.2)"
          backdropFilter="blur(80px)"
        >
          {/* {loading && <strong>Loading...</strong>}
          {error && <strong>Error occured</strong>} */}
          <MusicList items={data} editable={false} />
        </Box>
      )}
    </>
  );
};

export default SearchResults;
