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

# Refer to blueprints/nosql/history_bp.py
def test_music_retrieve_id_history(client):
    response = client.get('api/music/history/1', follow_redirects=True)
    assert response.status_code == 200
    
    response = client.get('api/music/history/-1', follow_redirects=True)
    assert response.status_code == 404

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
    
    response = client.get('/noalbum', follow_redirects=True)
    assert response.status_code == 404

# Refer to blueprints/sql/genre_bp.py
def test_genre_retrieve_all(client):
    response = client.get('/genre', follow_redirects=True)
    assert response.status_code == 200
    
    response = client.get('/nogenre', follow_redirects=True)
    assert response.status_code == 404

# Refer to blueprints/sql/music_bp.py
def test_music_create(client):
    from io import BytesIO
    data = {
        'title': 'test',
        'music_file': (BytesIO(b'mock'), 'test.mp3'),
        'genreId': 3,
        'ownerId': 3,
        'albumId': 1
    }

    response = client.post('/music/create', data=data, content_type='multipart/form-data')
    assert response.status_code == 422

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
def test_playlist_create(client):
    data = {
        'ownerId': 3,
        # 'creationDate': '',
        'title': 'Test',
        'description': ''
    }

    response = client.post('/playlist/create', data=data, content_type='multipart/form-data')
    assert response.status_code == 400

def test_playlist_add_song(client):
    response = client.post('/playlist/playlist=1/music=-1')
    assert response.status_code == 404

    response = client.post('/playlist/playlist=-1/music=3')
    assert response.status_code == 404

def test_playlist_update(client):
    data = {
        'title': 'Yo!',
        'description': 'Random description'
    }

    response = client.put('/playlist/1/update', data=data, content_type='multipart/form-data')
    assert response.status_code == 200

    response = client.put('/playlist/-1/update', data={}, content_type='multipart/form-data')
    assert response.status_code == 404

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

from argon2 import PasswordHasher

#######################################
# Email/token unit will not be tested #
#######################################

# Refer to utils.py
def test_music_get_save_dir():
    from utils import music_get_save_dir
    assert music_get_save_dir() == 'assets/music'

def test_music_get_duration():
    import os
    if os.path.exists('assets/music/yo!.mp3'):
        from utils import music_get_duration
        assert music_get_duration("yo!.mp3") == 6

def test_is_email_valid():
    from validation import validate_email
    assert validate_email("test@test.com")[0] == True

    invalid_list = {
        'test',
        'test@test',
        'test@test_test.com'
    }

    for invalid_email in invalid_list:
        assert validate_email("test@test.com")[0] == False

def test_hash_password():
    from utils import hash_password
    test_pwd = 'test'
    assert PasswordHasher().hash(test_pwd) != hash_password(test_pwd)

def test_check_needs_rehash():
    from utils import check_needs_rehash
    test_pwd = PasswordHasher().hash('test')
    assert PasswordHasher().check_needs_rehash(test_pwd) == check_needs_rehash(test_pwd)

def test_verify_password_hash():
    from utils import verify_password_hash
    test_pwd = PasswordHasher().hash('test')
    assert verify_password_hash(test_pwd, 'test') == True
