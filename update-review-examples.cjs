const fs = require('fs');
(async()=>{
const file='src/lib/data.ts';
const source=fs.readFileSync(file,'utf8');
const {reviews}=await import('./src/lib/data.ts');
const examples=[
['Amanda A.','Gostei de ter diferentes acessórios no mesmo kit. Posso variar o penteado e deixar tudo organizado depois de usar.'],
['Adriana D.','A cor lilás é linda! Gostei do formato da escova e de poder ajustar a temperatura durante a modelagem.'],
['Elisa M.','Escolhi a escova preta e gostei muito do visual. É uma opção prática para arrumar as pontas antes de sair.'],
['Camila S.','O visor facilita acompanhar a temperatura. Gostei da proposta de modelar o cabelo com uma escova só.'],
['Fernanda F.','O kit rosê ficou lindo na minha bancada. Os acessórios trazem várias possibilidades para mudar o visual.'],
['Natália R.','Gosto de alternar entre cabelo liso e pontas modeladas. Ter os acessórios juntos facilita minha rotina.'],
['Sabrina A.','Adoro um penteado com movimento nas pontas. Esse é o tipo de acabamento que gosto de fazer para ocasiões especiais.'],
['Juliana P.','Escolhi esse modelo para dar atenção às pontas do cabelo. Gostei do design e dos controles no cabo.'],
['Mariana L.','A escova combina com a minha rotina de beleza. Gosto de separar as mechas com calma para modelar.'],
['Beatriz C.','Gostei da ideia de renovar o penteado em casa. A escova tem um formato que combina com o acabamento que procuro.'],
['Renata M.','Os detalhes do produto me chamaram a atenção. É uma opção que eu escolheria para completar meus cuidados com o cabelo.'],
['Patrícia V.','Adoro acessórios de beleza que ajudam a variar o visual. Esse modelo entrou para a minha seleção de favoritos.'],
['Larissa T.','Prefiro penteados com as pontas bem definidas. Gostei da proposta da escova para esse tipo de finalização.'],
['Vanessa O.','O visual da escova é bonito e os controles ficam à mão. Gostei de conhecer essa opção para modelar o cabelo.']
];
reviews.forEach((r,i)=>{r.author=examples[i][0];r.text=examples[i][1];r.rating=5;});
fs.writeFileSync(file,source.slice(0,source.indexOf('export const reviews'))+'// Exemplos fictícios para demonstração; não são avaliações reais.\nexport const reviews: Review[] = '+JSON.stringify(reviews,null,2)+';\n');
let page=fs.readFileSync('src/pages/home.tsx','utf8');
page=page.replace('const reviewerPhoto = getImagePath("/images/logo-bellamix-preto.png");','const reviewerPhoto = getReviewerPhoto(review.author);');
page=page.replace('{review.text || "Fotos enviadas por cliente"}','"{review.text}"').replace('Registro em fotos','Depoimento fictício').replace('          Fotos\n','          Exemplo\n').replace('{reviews.length} depoimentos em fotos','Nomes e relatos fictícios para demonstração');
fs.writeFileSync('src/pages/home.tsx',page);
console.log('14 exemplos preenchidos; fotos e grupos preservados.');
})();
