import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Filter, CheckCircle2 } from 'lucide-react';
import { PRODUCTS } from '../constants';

export default function ProductCatalog({ onDownload }: { onDownload?: (productName: string) => void }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'biomass' | 'netzero'>('all');

  const filteredProducts = PRODUCTS.filter(product => {
    if (filter === 'all') return true;
    if (filter === 'biomass') {
      return ['wood-pellets', 'rice-husk-pellets', 'wood-chips'].includes(product.id);
    }
    if (filter === 'netzero') {
      return ['cashew-shell-cake', 'palm-kernel-shell', 'biomass-briquettes'].includes(product.id);
    }
    return true;
  });

  return (
    <section id="products" className="section-padding bg-hdb-earth/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">
            {t('catalog.tag', 'Product Catalog')}
          </h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {t('catalog.title', 'Biomass & Net Zero Fuels')}
          </h3>
          <p className="text-hdb-dark/60 text-lg">
            {t('catalog.description', 'Explore our comprehensive range of sustainable energy solutions designed to power your industrial needs while minimizing environmental impact.')}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-full p-1 border border-hdb-earth shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'all' ? 'bg-hdb-green text-white shadow-md' : 'text-hdb-dark/60 hover:text-hdb-dark'
              }`}
            >
              {t('catalog.filters.all', 'All Products')}
            </button>
            <button
              onClick={() => setFilter('biomass')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'biomass' ? 'bg-hdb-green text-white shadow-md' : 'text-hdb-dark/60 hover:text-hdb-dark'
              }`}
            >
              {t('catalog.filters.biomass', 'Biomass Energy')}
            </button>
            <button
              onClick={() => setFilter('netzero')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'netzero' ? 'bg-hdb-green text-white shadow-md' : 'text-hdb-dark/60 hover:text-hdb-dark'
              }`}
            >
              {t('catalog.filters.netzero', 'Net Zero Fuels')}
            </button>
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-hdb-earth hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                <div className="h-64 overflow-hidden relative shrink-0">
                  <img 
                    src={product.image} 
                    alt={t(`products.${product.id.replace(/-/g, '')}.name`)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hdb-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="bg-hdb-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                      {t('products.status')}
                    </span>
                    {['cashew-shell-cake', 'palm-kernel-shell', 'biomass-briquettes'].includes(product.id) && (
                      <span className="bg-hdb-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Net Zero
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="text-2xl font-bold mb-4">{t(`products.${product.id.replace(/-/g, '')}.name`)}</h4>
                  <p className="text-hdb-dark/60 text-sm mb-6 line-clamp-3 flex-grow">
                    {t(`products.${product.id.replace(/-/g, '')}.desc`)}
                  </p>
                  <div className="space-y-3 mb-8 bg-hdb-earth/10 p-4 rounded-2xl">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex justify-between text-sm border-b border-hdb-earth/50 last:border-0 pb-2 last:pb-0">
                        <span className="text-hdb-dark/60">
                          {spec.label === 'Nhiệt trị' ? t('products.specs.calorific') : 
                           spec.label === 'Độ ẩm' ? t('products.specs.moisture') : 
                           spec.label === 'Độ tro' ? t('products.specs.ash') : spec.label}
                        </span>
                        <span className="font-bold text-hdb-green">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onDownload && onDownload(product.name)}
                    className="w-full py-4 rounded-xl bg-hdb-earth/20 text-hdb-dark font-bold hover:bg-hdb-green hover:text-white transition-all flex items-center justify-center gap-2 mt-auto">
                    {t('products.details')} <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
