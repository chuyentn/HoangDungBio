import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Leaf, TrendingDown, Factory, CloudOff } from 'lucide-react';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t('solutions.carbonloop.title'),
      description: t('solutions.carbonloop.description'),
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: t('solutions.ecoloop.title'),
      description: t('solutions.ecoloop.description'),
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: t('solutions.boiler.title'),
      description: t('solutions.boiler.description'),
      color: "bg-amber-500/10 text-amber-500"
    },
    {
      icon: <CloudOff className="w-8 h-8" />,
      title: t('solutions.netzero.title'),
      description: t('solutions.netzero.description'),
      color: "bg-purple-500/10 text-purple-500"
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-hdb-dark mb-6">
            {t('solutions.tagline')}
          </h2>
          <p className="text-lg text-hdb-dark/60">
            {t('solutions.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-hdb-dark/5 hover:border-hdb-green/20 hover:shadow-xl hover:shadow-hdb-green/5 transition-all group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-hdb-dark mb-4">{feature.title}</h3>
              <p className="text-hdb-dark/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
