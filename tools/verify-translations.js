const fs = require('fs');
const path = require('path');

function readJSON(p){
  try{return JSON.parse(fs.readFileSync(p,'utf8'));}catch(e){return null}
}

function collectFiles(dir, exts=['.jsx','.js','.ts','.tsx']){
  const out=[];
  const entries=fs.readdirSync(dir,{withFileTypes:true});
  for(const e of entries){
    const full=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...collectFiles(full, exts));
    else if(exts.includes(path.extname(e.name))) out.push(full);
  }
  return out;
}

function extractKeysFromFile(p){
  const src=fs.readFileSync(p,'utf8');
  const regex=/t\(\s*['"]([^'"\)]+)['"]/g;
  const keys=new Set();
  let m;
  while((m=regex.exec(src))){
    keys.add(m[1].replace(/\?/g,''));
  }
  return Array.from(keys);
}

const projectRoot = path.resolve(__dirname,'..');
const localesDir = path.join(projectRoot,'src','locales');
const enFile = path.join(localesDir,'en.json');
const hiFile = path.join(localesDir,'hi.json');

const en = readJSON(enFile);
const hi = readJSON(hiFile);
if(!en || !hi){
  console.error('Missing en.json or hi.json in src/locales');
  process.exit(2);
}

const srcDir = path.join(projectRoot,'src');
const files = collectFiles(srcDir);
const allKeys = new Set();
for(const f of files){
  const keys = extractKeysFromFile(f);
  for(const k of keys) allKeys.add(k);
}

function hasKey(obj, key){
  const parts = key.split('.');
  let node = obj;
  for(const p of parts){
    if(node && Object.prototype.hasOwnProperty.call(node,p)) node = node[p];
    else return false;
  }
  return typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean' || Array.isArray(node) || typeof node === 'object';
}

const missing = { en: [], hi: [] };
for(const k of allKeys){
  if(!hasKey(en,k)) missing.en.push(k);
  if(!hasKey(hi,k)) missing.hi.push(k);
}

console.log('Translation check report:');
console.log('Total keys found in code:', allKeys.size);
if(missing.en.length===0 && missing.hi.length===0){
  console.log('\x1b[32mAll translation keys exist in both en.json and hi.json\x1b[0m');
  process.exit(0);
}
if(missing.en.length>0){
  console.log('\nMissing keys in en.json:');
  missing.en.forEach(k=>console.log('  -',k));
}
if(missing.hi.length>0){
  console.log('\nMissing keys in hi.json:');
  missing.hi.forEach(k=>console.log('  -',k));
}
process.exit(1);
