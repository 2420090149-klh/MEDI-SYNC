const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname,'..');
const localesDir = path.join(projectRoot,'src','locales');
const enFile = path.join(localesDir,'en.json');
const hiFile = path.join(localesDir,'hi.json');

function readJSON(p){
  try{return JSON.parse(fs.readFileSync(p,'utf8'));}catch(e){console.error('Failed to read',p,e.message);process.exit(2)}
}

function writeJSON(p,obj){
  fs.writeFileSync(p, JSON.stringify(obj, null, 2)+'\n', 'utf8');
}

function merge(src, target){
  let added = 0;
  for(const k of Object.keys(src)){
    if(typeof src[k] === 'object' && src[k] !== null && !Array.isArray(src[k])){
      if(!target[k] || typeof target[k] !== 'object'){
        target[k] = {};
      }
      added += merge(src[k], target[k]);
    } else {
      if(target[k] === undefined){
        target[k] = src[k];
        added++;
      }
    }
  }
  return added;
}

const en = readJSON(enFile);
let hi = readJSON(hiFile);
if(!hi){ hi = {}; }

// Backup existing hi.json
const backupPath = hiFile + '.' + Date.now() + '.bak';
fs.copyFileSync(hiFile, backupPath);

const added = merge(en, hi);
writeJSON(hiFile, hi);

console.log(`Merged missing keys from en.json into hi.json. Keys added: ${added}`);
console.log(`Backup of previous hi.json created at: ${backupPath}`);
process.exit(0);
