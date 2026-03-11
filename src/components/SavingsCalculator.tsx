import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, TrendingDown, Leaf, Clock, ArrowRight } from 'lucide-react';

export default function SavingsCalculator({ onOpenModal }: { onOpenModal: (intent: string) => void }) {
  const { t } = useTranslation();
  const [fuelType, setFuelType] = useState<'coal' | 'oil'>('coal');
  const [consumption, setConsumption] = useState<number>(100);
  const [price, setPrice] = useState<number>(4500);
  const [showResults, setShowResults] = useState(false);

  // Simple calculation logic for demo
  // Coal: ~5500 kcal/kg, Oil: ~10000 kcal/kg, Biomass: ~4200 kcal/kg
  // Efficiency: Coal/Oil ~80%, Biomass ~85%
  const calculateSavings = () => {
    const biomassPrice = 2800; // Average VND/kg for pellets
    const coalCalorific = 5500;
    const oilCalorific = 10000;
    const biomassCalorific = 4200;
    
    let currentCost = consumption * 1000 * price;
    let biomassNeeded = 0;
    
    if (fuelType === 'coal') {
      biomassNeeded = (consumption * coalCalorific) / biomassCalorific;
    } else {
      biomassNeeded = (consumption * oilCalorific) / biomassCalorific;
    }
    
    const biomassCost = biomassNeeded * biomassPrice;
    const annualSavings = (currentCost - biomassCost) * 12;
    const co2Saved = consumption * 12 * (fuelType === 'coal' ? 2.4 : 2.7); // Tons of CO2
    
    return {
      annualSavings: Math.round(annualSavings),
      co2Saved: Math.round(co2Saved),
      roi: fuelType === 'coal' ? '6-12' : '4-8'
    };
  };

  const results = calculateSavings();

  return (
    <section id="savings-calculator" className="py-24 bg-hdb-dark relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-hdb-green rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-hdb-accent rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hdb-green/10 border border-hdb-green/20 text-hdb-green text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Calculator className="w-4 h-4" />
              {t('calculator.title')}
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              {t('calculator.subtitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Input Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-3">{t('calculator.currentFuel')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['coal', 'oil'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFuelType(type)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                          fuelType === type 
                            ? 'bg-hdb-green border-hdb-green text-white shadow-lg shadow-hdb-green/20' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        {t(`calculator.fuels.${type}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-3">
                    {t('calculator.monthlyConsumption')}
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={consumption}
                    onChange={(e) => setConsumption(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-hdb-green mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">{consumption} <span className="text-sm font-normal text-white/40">Tấn</span></span>
                    <span className="text-xs text-white/40">10 - 1000 Tấn</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-3">
                    {t('calculator.currentPrice')}
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(parseInt(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-hdb-green"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs font-bold">VNĐ/kg</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowResults(true)}
                  className="w-full bg-hdb-green hover:bg-hdb-accent text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                >
                  {t('calculator.calculate')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Results Display */}
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl"
                  >
                    <Calculator className="w-16 h-16 text-white/10 mb-4" />
                    <p className="text-white/40 text-sm">{t('calculator.disclaimer')}</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="bg-hdb-green/10 border border-hdb-green/20 p-8 rounded-3xl">
                      <div className="flex items-center gap-3 text-hdb-green mb-2">
                        <TrendingDown className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">{t('calculator.annualSavings')}</span>
                      </div>
                      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                        ~{new Intl.NumberFormat('vi-VN').format(results.annualSavings)} <span className="text-lg font-normal text-white/40">VNĐ</span>
                      </div>
                      <p className="text-white/60 text-sm">{t('calculator.disclaimer')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <Leaf className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{t('calculator.co2Reduction')}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {results.co2Saved} <span className="text-xs font-normal text-white/40">Tấn/Năm</span>
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 text-amber-400 mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{t('calculator.roi')}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {results.roi} <span className="text-xs font-normal text-white/40">Tháng</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => onOpenModal('Energy Audit')}
                      className="w-full bg-white text-hdb-dark font-bold py-4 rounded-xl hover:bg-hdb-green hover:text-white transition-all"
                    >
                      {t('calculator.contactForAudit')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
