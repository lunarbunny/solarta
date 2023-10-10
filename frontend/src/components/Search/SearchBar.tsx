import { Box, Center, Flex, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import SearchResults from './SearchResult';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  return (
    <Flex p={2}>
      <AiOutlineSearch size={24} />
      <Input
        ms={2}
        flexGrow={1}
        type="text"
        placeholder='Search for songs, artists...'
        variant="unstyled"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <SearchResults query={query} />
    </Flex>
  );
};

export default SearchBar;