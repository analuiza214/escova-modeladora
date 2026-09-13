const fs = require('fs');
(async () => {
const {products} = await import('./src/lib/data.ts');
const dataPath='src/lib/data.ts';
const before=fs.readFileSync(dataPath,'utf8');
for(const p of products){p.price=p.slug.startsWith('kit-')?129.90:69.90;p.pixPrice=Number((p.price*0.9).toFixed(2));p.installment=`5x R$ ${(p.price/5).toFixed(2).replace('.',',')} sem juros`;}
const folder='Materiais/Depoimentos';
const files=fs.readdirSync(folder).filter(n=>n.endsWith('.webp')).sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));
const groups=new Map();
fs.mkdirSync('public/images/depoimentos',{recursive:true});
for(const name of files){const key=/^Depoimentos/i.test(name)?name:name.match(/^[a-z]+/i)[0].toLowerCase();if(!groups.has(key))groups.set(key,[]);groups.get(key).push('/images/depoimentos/'+name);fs.copyFileSync(folder+'/'+name,'public/images/depoimentos/'+name);}
const reviews=[...groups.entries()].map(([key,photos],i)=>({id:i+1,author:`Cliente ${String(i+1).padStart(2,'0')}`,rating:0,text:'',photos}));
fs.writeFileSync(dataPath,before.slice(0,before.indexOf('export const products'))+'export const products: Product[] = '+JSON.stringify(products,null,2)+';\n\nexport const reviews: Review[] = '+JSON.stringify(reviews,null,2)+';\n');
let page=fs.readFileSync('src/pages/home.tsx','utf8');
page=page.replace('const reviewerPhoto = getReviewerPhoto(review.author);','const reviewerPhoto = getImagePath("/images/logo-bellamix-preto.png");');
page=page.replace('"{review.text}"','{review.text || "Fotos enviadas por cliente"}');
page=page.replace('✓ Real','✓ Foto').replace('Comprador Verificado ✓','Registro em fotos').replace('⭐ Verificado','Fotos');
page=page.replace('+1.847 avaliações verificadas','{reviews.length} depoimentos em fotos');
fs.writeFileSync('src/pages/home.tsx',page);
console.log(JSON.stringify({products:products.length,escovas:products.filter(p=>p.price===69.9).length,kits:products.filter(p=>p.price===129.9).length,photos:files.length,groups:[...groups].map(([key,p])=>({key,count:p.length}))}));
})();
