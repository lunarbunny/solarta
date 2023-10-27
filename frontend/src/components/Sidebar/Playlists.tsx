import { TbPlaylist } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import { API_URL, Album, Artist, Playlist } from "@/types";
import SidebarItem from "./SidebarItem";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";

// const playlists: Playlist[] = [
//   { name: "Favourites" },
//   { name: "我们一起喵喵喵" },
//   { name: "阳光彩虹小白马" },
// ];

const Playlists = () => {
  const { data: playlists } = useFetch<Playlist[]>(
    `${API_URL}/playlist/owner/2`, // replace with user's ID instead
    true
  );
  return (
    <>
      {playlists &&
        playlists.map((pl, i) => (
          <Link key={i} href={`/playlist/${pl.id}`}>
            <SidebarItem
              key={i}
              name={pl.title}
              icon={
                pl.title == "Favourites" ? (
                  <AiOutlineHeart size={20} />
                ) : (
                  <TbPlaylist size={20} />
                )
              }
            />
          </Link>
        ))}
    </>
  );
};

export default Playlists;
