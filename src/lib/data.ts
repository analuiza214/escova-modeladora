export interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  photo?: string;
  photos?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  installment: string;
  pixPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: string;
  badge?: string;
  description: string;
  mainImage: string;
  gallery: string[];
  features: string[];
  productReviews?: Review[];
}

export const products: Product[] = [
  {
    "id": "bella-escova-branca",
    "slug": "escova-branca",
    "name": "Escova Branca",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Conheça a Escova Branca da nossa seleção de beleza. Confira as fotos para ver o produto e seus detalhes.",
    "mainImage": "/images/escova-branca/Escova A1.avif",
    "gallery": [
      "/images/escova-branca/Escova A1.avif",
      "/images/escova-branca/Escova A2.avif",
      "/images/escova-branca/Escova A3.avif",
      "/images/escova-branca/Escova A4.avif"
    ],
    "features": [
      "Cor branca"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-preta",
    "slug": "escova-preta",
    "name": "Escova Modeladora Preta",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora preta com detalhes rosé, visor digital e controles de temperatura. Confira o produto nas fotos da galeria.",
    "mainImage": "/images/escova-preta/Escova B1 (2).webp",
    "gallery": [
      "/images/escova-preta/Escova B1 (2).webp",
      "/images/escova-preta/Escova B1 (1).webp",
      "/images/escova-preta/Escova B1 (1).jpg",
      "/images/escova-preta/Escova B1 (2).jpg",
      "/images/escova-preta/Escova B1 (3).jpg"
    ],
    "features": [
      "Cor preta com detalhes rosé",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-rose",
    "slug": "escova-rose",
    "name": "Escova Modeladora Rosê",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora na cor rosê, com visor digital e controles de temperatura. Veja os detalhes na galeria.",
    "mainImage": "/images/escova-rose/1.webp",
    "gallery": [
      "/images/escova-rose/1.webp",
      "/images/escova-rose/2.webp",
      "/images/escova-rose/3.webp",
      "/images/escova-rose/4.webp"
    ],
    "features": [
      "Cor rosê",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-azul-ceu",
    "slug": "escova-azul-ceu",
    "name": "Escova Modeladora Azul Céu",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora na cor azul céu, com visor digital e controles de temperatura. Veja os detalhes na galeria.",
    "mainImage": "/images/escova-azul-ceu/1.webp",
    "gallery": [
      "/images/escova-azul-ceu/1.webp",
      "/images/escova-azul-ceu/2.webp",
      "/images/escova-azul-ceu/3.webp",
      "/images/escova-azul-ceu/4.webp"
    ],
    "features": [
      "Cor azul céu",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-verde",
    "slug": "escova-verde",
    "name": "Escova Modeladora Verde",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora na cor verde, com visor digital e controles de temperatura. Veja os detalhes na galeria.",
    "mainImage": "/images/escova-verde/1.webp",
    "gallery": [
      "/images/escova-verde/1.webp",
      "/images/escova-verde/2.webp",
      "/images/escova-verde/3.webp",
      "/images/escova-verde/4.webp"
    ],
    "features": [
      "Cor verde",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-lilas",
    "slug": "escova-lilas",
    "name": "Escova Modeladora Lilás",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora na cor lilás, com visor digital e controles de temperatura. Veja os detalhes na galeria.",
    "mainImage": "/images/escova-lilas/1.webp",
    "gallery": [
      "/images/escova-lilas/1.webp",
      "/images/escova-lilas/2.webp",
      "/images/escova-lilas/3.webp",
      "/images/escova-lilas/4.webp"
    ],
    "features": [
      "Cor lilás",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-escova-dourada",
    "slug": "escova-dourada",
    "name": "Escova Modeladora Dourada",
    "price": 69.9,
    "pixPrice": 62.91,
    "installment": "5x R$ 13,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Escova modeladora na cor dourada, com visor digital e controles de temperatura. Veja os detalhes na galeria.",
    "mainImage": "/images/escova-dourada/1.webp",
    "gallery": [
      "/images/escova-dourada/1.webp",
      "/images/escova-dourada/2.webp",
      "/images/escova-dourada/3.webp",
      "/images/escova-dourada/4.webp"
    ],
    "features": [
      "Cor dourada",
      "Visor digital",
      "Controles de temperatura"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-azul-ceu",
    "slug": "kit-7-em-1-azul-ceu",
    "name": "Kit 7 em 1 Escova Secadora Azul Céu",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor azul céu. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-azul-ceu/1.webp",
    "gallery": [
      "/images/kit-7-em-1-azul-ceu/1.webp",
      "/images/kit-7-em-1-azul-ceu/2.webp"
    ],
    "features": [
      "Cor azul céu",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-bege",
    "slug": "kit-7-em-1-bege",
    "name": "Kit 7 em 1 Escova Secadora Bege",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor bege. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-bege/1.webp",
    "gallery": [
      "/images/kit-7-em-1-bege/1.webp",
      "/images/kit-7-em-1-bege/2.webp",
      "/images/kit-7-em-1-bege/3.webp",
      "/images/kit-7-em-1-bege/4.webp",
      "/images/kit-7-em-1-bege/5.webp",
      "/images/kit-7-em-1-bege/6.webp"
    ],
    "features": [
      "Cor bege",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-branca",
    "slug": "kit-7-em-1-branca",
    "name": "Kit 7 em 1 Escova Secadora Branca",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor branca. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-branca/1.webp",
    "gallery": [
      "/images/kit-7-em-1-branca/1.webp"
    ],
    "features": [
      "Cor branca",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-lilas",
    "slug": "kit-7-em-1-lilas",
    "name": "Kit 7 em 1 Escova Secadora Lilás",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor lilás. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-lilas/1.webp",
    "gallery": [
      "/images/kit-7-em-1-lilas/1.webp",
      "/images/kit-7-em-1-lilas/2.webp"
    ],
    "features": [
      "Cor lilás",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-preta",
    "slug": "kit-7-em-1-preta",
    "name": "Kit 7 em 1 Escova Secadora Preta",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor preta. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-preta/1.webp",
    "gallery": [
      "/images/kit-7-em-1-preta/1.webp",
      "/images/kit-7-em-1-preta/2.webp",
      "/images/kit-7-em-1-preta/3.webp",
      "/images/kit-7-em-1-preta/4.webp"
    ],
    "features": [
      "Cor preta",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-rose",
    "slug": "kit-7-em-1-rose",
    "name": "Kit 7 em 1 Escova Secadora Rosê",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor rosê. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-rose/1.webp",
    "gallery": [
      "/images/kit-7-em-1-rose/1.webp"
    ],
    "features": [
      "Cor rosê",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  },
  {
    "id": "bella-kit-7-em-1-verde",
    "slug": "kit-7-em-1-verde",
    "name": "Kit 7 em 1 Escova Secadora Verde",
    "price": 129.9,
    "pixPrice": 116.91,
    "installment": "5x R$ 25,98 sem juros",
    "rating": 0,
    "reviewCount": 0,
    "soldCount": "",
    "description": "Kit de escova secadora com sete acessórios para diferentes estilos, na cor verde. Confira os componentes e detalhes na galeria.",
    "mainImage": "/images/kit-7-em-1-verde/1.webp",
    "gallery": [
      "/images/kit-7-em-1-verde/1.webp",
      "/images/kit-7-em-1-verde/2.webp"
    ],
    "features": [
      "Cor verde",
      "Kit com 7 acessórios"
    ],
    "productReviews": []
  }
];

// Exemplos fictícios para demonstração; não são avaliações reais.
export const reviews: Review[] = [
  {
    "id": 1,
    "author": "Amanda A.",
    "rating": 5,
    "text": "Gostei de ter diferentes acessórios no mesmo kit. Posso variar o penteado e deixar tudo organizado depois de usar.",
    "photos": [
      "/images/depoimentos/aa 1 (1).webp",
      "/images/depoimentos/aa 1 (2).webp"
    ]
  },
  {
    "id": 2,
    "author": "Adriana D.",
    "rating": 5,
    "text": "A cor lilás é linda! Gostei do formato da escova e de poder ajustar a temperatura durante a modelagem.",
    "photos": [
      "/images/depoimentos/ad 1 (1).webp",
      "/images/depoimentos/ad 1 (2).webp",
      "/images/depoimentos/ad 1 (3).webp"
    ]
  },
  {
    "id": 3,
    "author": "Elisa M.",
    "rating": 5,
    "text": "Escolhi a escova preta e gostei muito do visual. É uma opção prática para arrumar as pontas antes de sair.",
    "photos": [
      "/images/depoimentos/ae 1.webp"
    ]
  },
  {
    "id": 4,
    "author": "Camila S.",
    "rating": 5,
    "text": "O visor facilita acompanhar a temperatura. Gostei da proposta de modelar o cabelo com uma escova só.",
    "photos": [
      "/images/depoimentos/aess.webp"
    ]
  },
  {
    "id": 5,
    "author": "Fernanda F.",
    "rating": 5,
    "text": "O kit rosê ficou lindo na minha bancada. Os acessórios trazem várias possibilidades para mudar o visual.",
    "photos": [
      "/images/depoimentos/af  (1).webp",
      "/images/depoimentos/af  (2).webp"
    ]
  },
  {
    "id": 6,
    "author": "Natália R.",
    "rating": 5,
    "text": "Gosto de alternar entre cabelo liso e pontas modeladas. Ter os acessórios juntos facilita minha rotina.",
    "photos": [
      "/images/depoimentos/an 1.webp"
    ]
  },
  {
    "id": 7,
    "author": "Sabrina A.",
    "rating": 5,
    "text": "Adoro um penteado com movimento nas pontas. Esse é o tipo de acabamento que gosto de fazer para ocasiões especiais.",
    "photos": [
      "/images/depoimentos/as 1.webp",
      "/images/depoimentos/as 2.webp"
    ]
  },
  {
    "id": 8,
    "author": "Juliana P.",
    "rating": 5,
    "text": "Escolhi esse modelo para dar atenção às pontas do cabelo. Gostei do design e dos controles no cabo.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (11).webp"
    ]
  },
  {
    "id": 9,
    "author": "Mariana L.",
    "rating": 5,
    "text": "A escova combina com a minha rotina de beleza. Gosto de separar as mechas com calma para modelar.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (12).webp"
    ]
  },
  {
    "id": 10,
    "author": "Beatriz C.",
    "rating": 5,
    "text": "Gostei da ideia de renovar o penteado em casa. A escova tem um formato que combina com o acabamento que procuro.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (13).webp"
    ]
  },
  {
    "id": 11,
    "author": "Renata M.",
    "rating": 5,
    "text": "Os detalhes do produto me chamaram a atenção. É uma opção que eu escolheria para completar meus cuidados com o cabelo.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (14).webp"
    ]
  },
  {
    "id": 12,
    "author": "Patrícia V.",
    "rating": 5,
    "text": "Adoro acessórios de beleza que ajudam a variar o visual. Esse modelo entrou para a minha seleção de favoritos.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (17).webp"
    ]
  },
  {
    "id": 13,
    "author": "Larissa T.",
    "rating": 5,
    "text": "Prefiro penteados com as pontas bem definidas. Gostei da proposta da escova para esse tipo de finalização.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (18).webp"
    ]
  },
  {
    "id": 14,
    "author": "Vanessa O.",
    "rating": 5,
    "text": "O visual da escova é bonito e os controles ficam à mão. Gostei de conhecer essa opção para modelar o cabelo.",
    "photos": [
      "/images/depoimentos/Depoimentos 1 (19).webp"
    ]
  }
];
