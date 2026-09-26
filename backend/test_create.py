import json
import unittest
from unittest.mock import Mock, patch
from test_app import app, request


class CreateProjectTests(unittest.TestCase):
    def setUp(self):
        app.initialize()
        self.payload = {'request_id': 'a' * 32, 'title': '  My own film  ', 'logline': 'An uploaded film.', 'format': 'short film scene', 'tags': [' Night ', 'Night', 'Drama']}
        self.run_id = 'upload-' + self.payload['request_id']
        with app.connect() as db:
            db.execute('DELETE FROM documents WHERE run_id=?', (self.run_id,))
            db.execute('DELETE FROM uploads WHERE run_id=?', (self.run_id,))

    def create(self, payload=None):
        return app.create_run(request(json.dumps(self.payload if payload is None else payload)))

    def test_requires_owner_and_rejects_untrusted_origin(self):
        self.assertEqual(self.create().status_code, 401)
        login = app.login(request(json.dumps({'username': 'gordo', 'password': 'test'}), {'origin': 'https://directors-cut-two.vercel.app'}))
        token = json.loads(login.description)['token']
        result = app.create_run(request(json.dumps(self.payload), {'authorization': 'Bearer ' + token, 'origin': 'https://evil.example'}))
        self.assertEqual(result.status_code, 401)

    def test_creates_complete_catalog_record_without_prompts_and_survives_restart(self):
        with patch.object(app, 'authorized', return_value=True), patch.object(app.httpx, 'Client') as storage:
            result = self.create()
        self.assertEqual(result.status_code, 201)
        storage.assert_not_called()
        app.initialize()
        with app.connect() as db:
            run = app.document(db, self.run_id, 'run')
            self.assertEqual(run['title'], 'My own film')
            self.assertEqual(run['tags'], ['Night', 'Drama'])
            self.assertEqual(run['question'], '')
            for kind in ('answers', 'artifacts', 'prompts', 'decisions'):
                self.assertEqual(app.document(db, self.run_id, kind), [])
        runs = json.loads(app.index(request()).description)['runs']
        self.assertTrue(any(run.get('run_id') == self.run_id for run in runs))

    def test_replay_does_not_duplicate_or_overwrite_project(self):
        with patch.object(app, 'authorized', return_value=True):
            self.assertEqual(self.create().status_code, 201)
            self.assertEqual(self.create().status_code, 200)
            self.assertEqual(self.create({**self.payload, 'title': 'Different'}).status_code, 409)
        with app.connect() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM documents WHERE run_id=?', (self.run_id,)).fetchone()[0], 5)
            self.assertEqual(app.document(db, self.run_id, 'run')['title'], 'My own film')

    def test_invalid_inputs_create_no_records(self):
        invalid = [None, [], {'title': ' '}, {'title': 'x' * 121}, {'logline': 'x' * 601}, {'tags': 'film'}, {'tags': [None]}, {'tags': [' ']}, {'tags': ['x' * 41]}, {'tags': ['x'] * 21}, {'format': 'invalid'}, {'request_id': '../other'}]
        with patch.object(app, 'authorized', return_value=True):
            for changes in invalid:
                payload = {**self.payload, **changes} if isinstance(changes, dict) else changes
                result = app.create_run(request(json.dumps(payload)))
                self.assertEqual(result.status_code, 400, repr(changes))
        with app.connect() as db:
            self.assertIsNone(app.document(db, self.run_id, 'run'))

    def test_upload_without_writer_finishes_and_becomes_reviewable(self):
        with patch.object(app, 'authorized', return_value=True):
            self.create()
        media = Mock(); media.json.return_value = {'bucket': 'directors-cut', 'objectKey': '', 'publicUrl': 'https://example.test/video.mp4'}
        client = Mock()
        def store(*args, **kwargs):
            key = kwargs['data']['folder'] + '/' + kwargs['files']['file'][0]
            media.json.return_value['objectKey'] = key
            return media
        client.post.side_effect = store
        with patch.object(app, 'authorized', return_value=True), patch.object(app.httpx, 'Client') as factory:
            factory.return_value.__enter__.return_value = client
            upload = app.upload(request(b'test video', {'x-run-id': self.run_id, 'x-filename': 'film.mp4'}))
        self.assertEqual(upload.status_code, 202)
        upload_id = json.loads(upload.description)['upload_id']
        with app.connect() as db:
            db.execute("UPDATE uploads SET status='processing',job_id='new-project-job' WHERE id=?", (upload_id,))
        status = Mock(status_code=200); status.json.return_value = {'job': {'status': 'completed'}}
        result = Mock(); result.json.return_value = {'segments': [{'thumbnail_url': 'https://example.test/thumb.jpg'}], 'duration_seconds': 2}
        client.get.side_effect = [status, result]
        with patch.object(app.httpx, 'Client') as factory:
            factory.return_value.__enter__.return_value = client
            app.process_once()
            app.process_once()
        with app.connect() as db:
            artifacts = app.document(db, self.run_id, 'artifacts')
            self.assertEqual(len(artifacts), 1)
            self.assertIsNone(artifacts[0]['answer_id'])
            self.assertEqual(artifacts[0]['version_number'], 1)
            self.assertEqual(app.document(db, self.run_id, 'run')['status'], 'ready_for_review')
