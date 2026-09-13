const sharp = require('C:/Users/welli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/welli/Desktop/Bella Mix/output/azul-ceu';
(async () => {
 const files = JSON.parse(fs.readFileSync(path.join(dir,'origens.json'),'utf8'));
 for (let i=0;i<files.length;i++) {
  const dest = path.join(dir,`Escova-A${i+1}-Azul-Ceu.png`);
  await sharp(files[i]).resize(2048,2048,{kernel:'lanczos3'}).png().toFile(dest);
  const m=await sharp(dest).metadata();
  console.log(dest,m.width,m.height);
 }
})();
