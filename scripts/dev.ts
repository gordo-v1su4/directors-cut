#!/usr/bin/env bun
// Development uses the same server catalog as production; no local importer.
const vite=Bun.spawn(['bunx','vite','dev',...process.argv.slice(2)],{stdout:'inherit',stderr:'inherit'});
const stop=()=>vite.kill();process.on('SIGINT',stop);process.on('SIGTERM',stop);
process.exitCode=await vite.exited;
