import { test, expect } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { catalog, objectFolder, safeId } from './media-catalog';

test('object layout isolates projects and rejects traversal', () => {
  expect(objectFolder('last-prescription','job-123','2026-09-14T05:00:00Z')).toBe('media-uploads/2026/09_14/last-prescription/generations/job-123');
  expect(() => safeId('../stack-structure')).toThrow();
  expect(() => objectFolder('x','y','bad date')).toThrow();
});
test('job registration and asset import survive reopening without duplication', () => {
  const dir=mkdtempSync(join(tmpdir(),'directors-cut-test-'));
  const file=join(dir,'catalog.sqlite');
  try {
    let db=catalog(file);
    for(let i=0;i<2;i++) db.query('INSERT OR IGNORE INTO jobs(job_id,run_id,answer_id,prompt,updated_at) VALUES (?,?,?,?,?)').run('job','project','answer','exact original prompt','now');
    db.query('INSERT OR REPLACE INTO assets VALUES (?,?,?)').run('artifact','project','{}');
    db.close(); db=catalog(file);
    expect(db.query('SELECT COUNT(*) AS n FROM jobs').get()).toEqual({n:1});
    expect(db.query('SELECT prompt,status FROM jobs').get()).toEqual({prompt:'exact original prompt',status:'pending'});
    expect(db.query('SELECT COUNT(*) AS n FROM assets').get()).toEqual({n:1}); db.close();
  } finally {rmSync(dir,{recursive:true,force:true});}
});
