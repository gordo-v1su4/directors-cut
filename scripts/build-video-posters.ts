import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '../content/comparisons');
let count = 0;
for (const run of readdirSync(root)) {
  const media = join(root, run, 'media');
  if (!existsSync(media)) continue;
  for (const name of readdirSync(media)) {
    if (!/\.(mp4|webm|mov)$/i.test(name)) continue;
    const source = join(media, name);
    const poster = `${source}.jpg`;
    if (existsSync(poster) && statSync(poster).mtimeMs >= statSync(source).mtimeMs) continue;
    const result = Bun.spawnSync(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', '0.5', '-i', source, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '3', poster]);
    if (result.exitCode !== 0) throw new Error(`Poster generation failed for ${source}: ${result.stderr.toString()}`);
    count++;
  }
}
console.log(`Generated ${count} video posters.`);
