import { Link } from "wouter";
import { products } from "@/lib/data";
import { getImagePath } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const collections = [
    { id: "escovas", title: "Escovas modeladoras", description: "Encontre a cor que combina com você.", items: products.filter(p => !p.slug.startsWith("kit-")) },
    { id: "kits", title: "Kits 7 em 1", description: "Um kit, diferentes possibilidades para o seu cabelo.", items: products.filter(p => p.slug.startsWith("kit-")) },
  ];
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-amber-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-4">Coleção Bella Mix</p>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 leading-tight">Seu estilo.<br />Sua cor favorita.</h1>
            <p className="mt-5 text-gray-600 max-w-md leading-relaxed">Conheça nossas escovas modeladoras e kits 7 em 1. Escolha sua cor e veja cada detalhe do seu próximo favorito.</p>
            <a href="#produtos" className="inline-flex items-center gap-2 mt-7 rounded-xl bg-blue-800 px-6 py-3 text-sm font-bold text-white hover:bg-blue-900">Explorar produtos <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[products.find(p => p.slug === 'escova-rose'), products.find(p => p.slug === 'kit-7-em-1-lilas')].map(p => p && (
              <Link key={p.id} href={`/produto/${p.slug}`} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow">
                <img src={getImagePath(p.mainImage)} alt={p.name} width={600} height={600} className="aspect-square w-full object-contain" fetchPriority="high" />
                <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-800">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div id="produtos" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-28">
        {collections.map(collection => (
          <section key={collection.id} id={collection.id} className="mb-12 scroll-mt-28">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">{collection.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{collection.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {collection.items.map(product => (
                <Link key={product.id} href={`/produto/${product.slug}`} className="group flex flex-col rounded-2xl border border-gray-200 overflow-hidden bg-white hover:border-amber-300 hover:shadow-md transition-all">
                  <div className="p-3 sm:p-4 bg-white">
                    <img src={getImagePath(product.mainImage)} alt={product.name} width={600} height={600} loading="lazy" decoding="async" className="w-full aspect-square object-contain group-hover:scale-[1.03] transition-transform" />
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-3">{product.name}</h3>
                    <p className="mt-auto font-bold text-amber-700">{product.price > 0 ? product.price.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}) : 'Preço em breve'}</p>
                    <span className="mt-3 rounded-lg bg-blue-800 py-2.5 text-center text-xs font-bold text-white group-hover:bg-blue-900">VER PRODUTO</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
