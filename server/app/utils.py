import os
import eyed3
import sys

def music_get_save_dir():
    dir = os.environ.get("MUSIC_ASSET_DIR")
    if dir is None:
        print("MUSIC_ASSET_DIR not set", file=sys.stderr)
        sys.exit(1)
    elif not os.path.isdir(dir):
        print(f"{dir} is not a directory", file=sys.stderr)
        sys.exit(1)
    return dir

def music_get_duration(music_filename):
    file = eyed3.load(music_get_save_dir(music_filename))
    if file is not None:
        duration = file.info.time_secs
        return duration
