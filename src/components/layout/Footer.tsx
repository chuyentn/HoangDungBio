import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-hdb-dark text-white/60 py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-hdb-green rounded-lg flex items-center justify-center">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-display font-bold text-white tracking-tighter">
                HDB <span className="text-hdb-accent">Biomass</span>
              </span>
            </div>
            <p className="text-lg max-w-md mb-8 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              {[Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-hdb-green hover:border-hdb-green hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.solutions')}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-hdb-green transition-colors">CarbonLoop™ Consulting</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">EcoLoop™ Supply</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">Net Zero Roadmap</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">Boiler Optimization</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t('footer.support')}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-hdb-green transition-colors">{t('footer.contactSupport')}</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">{t('footer.quote')}</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">{t('footer.datasheet')}</a></li>
              <li><a href="#" className="hover:text-hdb-green transition-colors">{t('footer.faq')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-hdb-green" />
              {t('footer.address')}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-hdb-green" />
              +84 90 123 4567
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>MST: 3604011176</span>
          </div>
        </div>
        
        <div className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] opacity-30">
          {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}
