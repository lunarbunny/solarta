import pytest
from main import app

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
def test_music_delete(client):
    pass

def test_music_create(client):
    pass

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
def test_playlist_delete(client):
    pass

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
