async function n(){const t=await fetch("/data/prompt-cards.index.jsonl");return t.ok?(await t.text()).split(`
`).filter(a=>a.trim().length>0).map(a=>JSON.parse(a)):(console.error("Failed to load prompt-cards.index.jsonl:",t.status),[])}async function s(t){return(await n()).find(a=>a.slug===t)??null}export{s as a,n as l};
