import { Playlist } from "../../types";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import SidebarItem from "./SidebarItem";
import Link from "next/link";

const playlists: Playlist[] = [
  { name: "Favourites" },
  { name: "我们一起喵喵喵" },
  { name: "阳光彩虹小白马" },
];

const Playlists = () => {
  return (
    <>
      {playlists.map((pl, i) => (
        <Link key={i} href="/playlist">
          <SidebarItem
            key={i}
            name={pl.name}
            icon={
              pl.name == "Favourites" ? (
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
