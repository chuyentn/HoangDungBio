import React from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] bg-hdb-dark flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-hdb-green/20 border border-hdb-green/30 flex items-center justify-center">
          <Leaf className="w-12 h-12 text-hdb-green animate-pulse" />
        </div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-hdb-green/20 border-t-hdb-green rounded-3xl animate-spin" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-white/40 text-xs font-bold uppercase tracking-[0.3em]"
      >
        Hoàng Dung Biomass
      </motion.p>
    </div>
  );
}
