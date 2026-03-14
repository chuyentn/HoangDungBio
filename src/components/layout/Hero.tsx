import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, TrendingDown, Factory } from 'lucide-react';

export default function Hero({ onOpenModal }: { onOpenModal: (intent: string) => void }) {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hdb-dark">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-hdb-green/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-hdb-dark to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2000" 
          alt="Renewable Energy" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hdb-green/20 border border-hdb-green/30 text-hdb-green text-xs font-bold uppercase tracking-widest mb-8">
              <Leaf className="w-4 h-4" />
              {t('hero.tagline')}
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-white leading-[0.9] mb-8 tracking-tighter">
              {t('hero.title')} <br />
              <span className="text-hdb-green italic">Net Zero</span> Future.
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onOpenModal('Net Zero Roadmap')}
                className="px-8 py-4 bg-hdb-green text-white rounded-full font-bold text-lg hover:bg-hdb-accent transition-all shadow-xl shadow-hdb-green/20 flex items-center justify-center gap-2 group"
              >
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('savings-calculator');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                {t('hero.cta.secondary')}
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-white/10"
          >
            <div>
              <div className="text-3xl font-bold text-white mb-1">15+</div>
              <div className="text-sm text-white/40 uppercase tracking-wider font-bold">{t('hero.stats.experience')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">500k+</div>
              <div className="text-sm text-white/40 uppercase tracking-wider font-bold">{t('hero.stats.carbon')}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/40 uppercase tracking-wider font-bold">{t('hero.stats.renewable')}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
