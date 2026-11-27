import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const destination=path.join(root,'dist');
const files=new Map();
async function collect(relative){
 const name=path.posix.normalize(relative);
 if(name==='..'||name.startsWith('../')||path.isAbsolute(name))throw Error('Invalid build path: '+name);
 if(files.has(name))return;
 const data=await fs.readFile(path.join(root,name));files.set(name,data);
 if(name.endsWith('.js'))new vm.Script(data.toString(),{filename:name});
 const source=data.toString();
 const refs=name.endsWith('.html')?[...source.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]):name.endsWith('.css')?[...source.matchAll(/url\(\s*['"]?([^'"\s)]+)['"]?\s*\)/g)].map(m=>m[1]):[];
 for(const ref of refs){if(/^(?:data:|https?:|#)/.test(ref))continue;await collect(path.posix.join(path.posix.dirname(name),ref.split(/[?#]/)[0]))}
}
await collect('index.html');
const context={window:{}};vm.createContext(context);
for(const name of ['catalog.js','personal-data.js'])vm.runInContext(files.get(name).toString(),context,{filename:name});
const assets=[...context.window.CAT_ASSETS,...context.window.PERSONAL_ASSETS];
if(assets.length!==107||new Set(assets.map(a=>a.id)).size!==assets.length)throw Error('Asset catalog is inconsistent');
for(const asset of assets)await collect(asset.url);
files.set('.nojekyll',Buffer.alloc(0));
// dist contains only reproducible build outputs, never source photographs or tooling.
await fs.rm(destination,{recursive:true,force:true});await fs.mkdir(destination,{recursive:true});
for(const [name,data] of files){const target=path.join(destination,name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,data)}
const manifest={name:'拼好咪',version:'1.0.0',entry:'index.html',parts:assets.length,files:[...files].map(([name,data])=>({path:name,bytes:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')}))};
await fs.writeFile(path.join(destination,'build-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const bytes=[...files.values()].reduce((sum,data)=>sum+data.length,0);
console.log(JSON.stringify({status:'built',directory:destination,files:files.size+1,parts:assets.length,sizeMB:Number((bytes/1024/1024).toFixed(2))},null,2));
