#!/usr/bin/env bun
const index=Bun.spawnSync(['bun','scripts/build-comparisons-index.ts'],{stdout:'inherit',stderr:'inherit'});
if(index.exitCode) process.exit(index.exitCode);
const worker=Bun.spawn(['bun','--env-file=.env.local','scripts/media-server.ts'],{stdout:'inherit',stderr:'inherit'});
const vite=Bun.spawn(['bunx','vite','dev',...process.argv.slice(2)],{stdout:'inherit',stderr:'inherit'});
const stop=()=>{worker.kill();vite.kill();};process.on('SIGINT',stop);process.on('SIGTERM',stop);
await Promise.race([worker.exited,vite.exited]);stop();
