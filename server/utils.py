import os

def music_get_path(music_filename):
    return os.path.join("assets/music", music_filename)

def music_save(music_file):
    music_file.save(music_get_path(music_file.filename))

def music_get_duration(music_filename):
    import eyed3
    file = eyed3.load(music_get_path(music_filename))
    if file is not None:
        duration = file.info.time_secs
        return duration
