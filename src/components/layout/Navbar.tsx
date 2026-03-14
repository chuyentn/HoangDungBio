import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Menu, X, LayoutDashboard, User, LogIn, LogOut, UserPlus } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  scrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  user: FirebaseUser | null;
  isAdmin: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  setCurrentView: (view: 'main' | 'crm') => void;
  openModal: (intent: string) => void;
}

export default function Navbar({ 
  scrolled, 
  isMenuOpen, 
  setIsMenuOpen, 
  user, 
  isAdmin, 
  handleLogin, 
  handleLogout, 
  setCurrentView, 
  openModal
}: NavbarProps) {
  const { t, i18n } = useTranslation();

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setCurrentView('main')}
        >
          <div className="w-10 h-10 bg-hdb-green rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className={`text-2xl font-display font-bold tracking-tighter ${scrolled ? 'text-hdb-dark' : 'text-white'}`}>
            HDB <span className="text-hdb-accent">Biomass</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { key: 'solutions', label: t('nav.solutions') },
            { key: 'products', label: t('nav.products') },
            { key: 'carbonloop', label: t('nav.carbonloop') },
            { key: 'projects', label: t('nav.projects') }
          ].map((item) => (
            <a 
              key={item.key} 
              href={`#${item.key}`} 
              className={`text-sm font-bold uppercase tracking-widest hover:text-hdb-green transition-colors ${scrolled ? 'text-hdb-dark' : 'text-white'}`}
            >
              {item.label}
            </a>
          ))}
          
          {isAdmin && (
            <button 
              onClick={() => setCurrentView('crm')}
              className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:text-hdb-green transition-colors ${scrolled ? 'text-hdb-dark' : 'text-white'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t('nav.crmDashboard')}
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher scrolled={scrolled} />
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 p-1 pr-4 bg-hdb-earth/30 rounded-full border border-hdb-earth/50">
                <div className="w-8 h-8 rounded-full bg-hdb-green/20 flex items-center justify-center overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-hdb-green" />}
                </div>
                <span className="text-xs font-bold text-hdb-dark">{user.displayName?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className={`p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all`}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all border ${
                scrolled ? 'border-hdb-dark text-hdb-dark hover:bg-hdb-dark hover:text-white' : 'border-white text-white hover:bg-white hover:text-hdb-dark'
              }`}
            >
              <LogIn className="w-4 h-4" />
              {i18n.language === 'vi' ? 'Đăng nhập' : 'Login'}
            </button>
          )}

          <button 
            onClick={() => openModal('Báo giá nhanh')}
            className="bg-hdb-green text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-hdb-accent transition-all shadow-lg shadow-hdb-green/20"
          >
            {t('nav.getQuote')}
          </button>
        </div>

        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className={scrolled ? 'text-hdb-dark' : 'text-white'} /> : <Menu className={scrolled ? 'text-hdb-dark' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-hdb-earth overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {[
                { key: 'solutions', label: t('nav.solutions') },
                { key: 'products', label: t('nav.products') },
                { key: 'carbonloop', label: t('nav.carbonloop') },
                { key: 'projects', label: t('nav.projects') }
              ].map((item) => (
                <a 
                  key={item.key} 
                  href={`#${item.key}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-hdb-dark hover:text-hdb-green transition-colors"
                >
                  {item.label}
                </a>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setCurrentView('crm');
                  }}
                  className="text-lg font-bold text-hdb-green flex items-center gap-2 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {t('nav.crmDashboard')}
                </button>
              )}
              <div className="pt-4 border-t border-hdb-earth flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-hdb-dark/40 uppercase tracking-widest">{i18n.language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                  <LanguageSwitcher scrolled={true} />
                </div>
                
                {user ? (
                  <div className="flex items-center justify-between p-4 bg-hdb-earth/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-hdb-green/20 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-hdb-green" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-hdb-dark">{user.displayName || 'User'}</p>
                        <p className="text-[10px] text-hdb-dark/50">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 text-xl rounded-lg">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setIsMenuOpen(false); handleLogin(); }}
                    className="flex items-center justify-center gap-2 py-3 border border-hdb-dark/20 rounded-xl font-bold text-hdb-dark"
                  >
                    <LogIn className="w-4 h-4" />
                    {i18n.language === 'vi' ? 'Đăng nhập' : 'Login'}
                  </button>
                )}
              </div>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  openModal('Báo giá nhanh');
                }}
                className="w-full bg-hdb-green text-white py-4 rounded-xl font-bold shadow-lg shadow-hdb-green/20"
              >
                {t('nav.getQuote')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
