import pytest
from main import app

#######################################
# 1. GET: test all scenarios          #
# 2. POST: only testing failure cases #
# 3. DELETE: not testing              #
#######################################

# Set up test client
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Functions to aid tests
def get_music_fp_platform(filename):
    import sys
    if sys.platform.startswith('win'):
        return f'assets\\music\\{filename}'
    return f'assets/music/{filename}'

# Refer to blueprints/nosql/history_bp.py
def test_music_retrieve_id_history(client):
    response = client.get('api/music/history/1', follow_redirects=True)
    assert response.status_code == 200

# Refer to blueprints/sql/album_bp.py
def test_album_retrieve_all_music(client):
    response = client.get('/album/1/music', follow_redirects=True)
    assert response.status_code == 200

    response = client.get('/album/-1/music', follow_redirects=True)
    assert response.status_code == 404

def test_album_by_artist(client):
    response = client.get('/album/artist=1', follow_redirects=True)
    assert response.status_code == 200

    response = client.get('/album/artist=-1', follow_redirects=True)
    assert response.status_code == 404

def test_album_retrieve_all(client):
    response = client.get('/album', follow_redirects=True)
    assert response.status_code == 200

# Refer to blueprints/sql/genre_bp.py
def test_genre_retrieve_all(client):
    response = client.get('/genre', follow_redirects=True)
    assert response.status_code == 200

# Refer to blueprints/sql/music_bp.py
def test_music_create(client):
    from io import BytesIO
    import os

    data = {
        'title': 'test',
        'music_file': (BytesIO(b'mock'), 'test.mp3'),
        'genreId': 3,
        'ownerId': 2
    }

    response = client.post('/music/create', data=data, content_type='multipart/form-data')
    assert response.status_code == 422
    assert os.path.exists(get_music_fp_platform('test.mp3'))
    os.remove(get_music_fp_platform('test.mp3'))

    response = client.post('/music/create', data={})
    assert response.status_code == 400

def test_music_search_string(client):
    response = client.get('music/search=YO!', follow_redirects=True)
    assert response.status_code == 200

def test_music_play_id(client):
    response = client.get('/music/play/1', follow_redirects=True)
    assert response.status_code == 200

    response = client.get('/music/play/-1', follow_redirects=True)
    assert response.status_code == 404

def test_music_retrieve_all(client):
    response = client.get('/music', follow_redirects=True)
    assert response.status_code == 200

# Refer to blueprints/sql/playlist_bp
def test_playlist_retrieve_all_music(client):
    response = client.get('/playlist/1/music', follow_redirects=True)
    assert response.status_code == 200

    response = client.get('/playlist/-1/music', follow_redirects=True)
    assert response.status_code == 404

def test_playlist_retrieve_user(client):
    response = client.get('/playlist/owner/1', follow_redirects=True)
    assert response.status_code == 200

# Refer to blueprints/sql/user_bp.py
def test_user_retrieve_all(client):
    response = client.get('/user', follow_redirects=True)
    assert response.status_code == 200

# Refer to utils.py
def test_music_get_path():
    from utils import music_get_save_dir
    assert music_get_save_dir('test.mp3') == get_music_fp_platform('test.mp3')

def test_music_get_duration():
    import os
    if os.path.exists('assets/music/yo!.mp3'):
        from utils import music_get_duration
        assert music_get_duration("yo!.mp3") == 6.99
    