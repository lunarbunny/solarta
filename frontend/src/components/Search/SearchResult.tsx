import useFetch from '@/hooks/useFetch';
import { Box } from '@chakra-ui/react';
import SidebarItem from '../Sidebar/SidebarItem';

type Props = {
  query: string;
};

const SearchResults = ({ query }: Props) => {
  //const { data, loading, error } = useFetch<SearchRespose>(`${API_URL}}/search?q=${query}`);

  return (
    <>
      {
        query &&
        <Box
          position='absolute'
          w='50%'
          top='5%'
          background='rgba(5, 14, 150, 0.2)'
          backdropFilter='blur(80px)'
        >
          {/* {loading && <strong>Loading...</strong>}
          {error && <strong>Error occured</strong>} */}

          <SidebarItem name='Result 1' icon={<></>} />
          <SidebarItem name='Result 2' icon={<></>} />
          <SidebarItem name='Result 3' icon={<></>} />
          <SidebarItem name='Result 4' icon={<></>} />
          <SidebarItem name='Result 5' icon={<></>} />
        </Box >
      }
    </>
  );
};

export default SearchResults;