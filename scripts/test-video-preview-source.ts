import { readFile } from 'node:fs/promises';

const files = [
  'src/lib/components/VersionedArtifactCell.svelte',
  'src/lib/components/MediaLightbox.svelte',
  'src/lib/components/HoverVideoPreview.svelte',
  'src/routes/+page.svelte',
  'src/routes/comparisons/+page.svelte',
];

let passed = 0;
let failed = 0;
function check(name: string, condition: boolean): void {
  if (condition) passed++;
  else { failed++; console.error(`FAIL ${name}`); }
}

for (const file of files) {
  const source = await readFile(file, 'utf8');
  check(`${file} never uses a potentially unrelated thumbnail as a video poster`, !/poster=\{[^}]*thumbnail_url[^}]*\}/.test(source));
}

const cell = await readFile('src/lib/components/VersionedArtifactCell.svelte', 'utf8');
check('active comparison video always uses returned media URL', /<video\s+[\s\S]*?src=\{active\.media_url\}/.test(cell));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
