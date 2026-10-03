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
            db.execute('DELETE FROM deleted_runs WHERE run_id=?', (self.run_id,))

    def create(self, payload=None):
        return app.create_run(request(json.dumps(self.payload if payload is None else payload)))

    def test_requires_owner_and_rejects_untrusted_origin(self):
        self.assertEqual(self.create().status_code, 401)
        login = app.login(request(json.dumps({'username': 'gordo', 'password': 'test'}), {'origin': 'https://trailer-feed.vercel.app'}))
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

    def test_duplicate_display_title_is_rejected_on_create_and_rename(self):
        second = {**self.payload, 'request_id': 'b' * 32, 'title': 'My own film — alternate cut'}
        other_id = 'upload-' + second['request_id']
        with app.connect() as db:
            db.execute('DELETE FROM documents WHERE run_id=?', (other_id,))
        with patch.object(app, 'authorized', return_value=True):
            self.assertEqual(self.create().status_code, 201)
            duplicate = self.create(second)
            self.assertEqual(duplicate.status_code, 409)
            self.assertEqual(json.loads(duplicate.description)['existing_run_id'], self.run_id)
            second['title'] = 'Another film'
            self.assertEqual(self.create(second).status_code, 201)
            rename = app.run_details(request(json.dumps({'title': 'MY OWN FILM (2026)'}), params={'run_id': other_id}))
            self.assertEqual(rename.status_code, 409)
        with app.connect() as db:
            self.assertEqual(app.document(db, other_id, 'run')['title'], 'Another film')

    def test_removal_cleans_storage_then_tombstones_project(self):
        with patch.object(app, 'authorized', return_value=True):
            self.assertEqual(self.create().status_code, 201)
        key = f'media-uploads/2026/09_27/{self.run_id}/versions/v1/video.mp4'
        with app.connect() as db:
            db.execute('INSERT INTO uploads VALUES (?,?,?,?,?,?,?,?,?,?)',
                ('remove-qa', self.run_id, 'remove-sha', 1, key, None, None, 'failed', None, '2026-09-27'))
        response = Mock(status_code=200)
        response.json.return_value = {'deleted': 1, 'failed': []}
        client = Mock()
        client.post.return_value = response
        with patch.object(app, 'authorized', return_value=True), patch.object(app.httpx, 'Client') as factory:
            factory.return_value.__enter__.return_value = client
            result = app.delete_run(request(json.dumps({'confirm_run_id': self.run_id}), params={'run_id': self.run_id}))
        self.assertEqual(result.status_code, 200)
        self.assertIn(f'media-uploads/2026/09_27/{self.run_id}/', client.post.call_args.kwargs['json']['prefixes'])
        app.initialize()
        with app.connect() as db:
            self.assertIsNone(app.document(db, self.run_id, 'run'))
            self.assertEqual(db.execute('SELECT count(*) FROM uploads WHERE run_id=?', (self.run_id,)).fetchone()[0], 0)
        with patch.object(app, 'authorized', return_value=True):
            self.assertEqual(self.create().status_code, 409)

    def test_failed_storage_cleanup_keeps_project_for_retry(self):
        with patch.object(app, 'authorized', return_value=True):
            self.assertEqual(self.create().status_code, 201)
        response = Mock(status_code=502)
        response.raise_for_status.side_effect = app.httpx.HTTPError('storage offline')
        client = Mock()
        client.post.return_value = response
        with patch.object(app, 'authorized', return_value=True), patch.object(app.httpx, 'Client') as factory:
            factory.return_value.__enter__.return_value = client
            result = app.delete_run(request(json.dumps({'confirm_run_id': self.run_id}), params={'run_id': self.run_id}))
        self.assertEqual(result.status_code, 502)
        with app.connect() as db:
            self.assertIsNotNone(app.document(db, self.run_id, 'run'))

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
        media = Mock(); media.json.return_value = {'bucket': 'trailer-feed', 'objectKey': '', 'publicUrl': 'https://example.test/video.mp4'}
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
