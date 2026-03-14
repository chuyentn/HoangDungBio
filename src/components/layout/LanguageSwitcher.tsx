import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  scrolled?: boolean;
  className?: string;
}

const languages = [
  { code: 'vi', label: 'VN', flag: 'vn' },
  { code: 'en', label: 'EN', flag: 'us' },
  { code: 'ko', label: 'KR', flag: 'kr' },
  { code: 'ja', label: 'JP', flag: 'jp' },
  { code: 'zh', label: 'CN', flag: 'cn' },
  { code: 'es', label: 'ES', flag: 'es' }
];

export default function LanguageSwitcher({ scrolled = false, className = "" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex(l => l.code === i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex].code);
  };

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  return (
    <button 
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
        scrolled 
          ? 'border-hdb-dark/20 text-hdb-dark hover:bg-hdb-dark/5' 
          : 'border-white/20 text-white hover:bg-white/10'
      } ${className}`}
    >
      <img 
        src={`https://flagcdn.com/w20/${currentLang.flag}.png`} 
        alt={currentLang.label} 
        className="w-5 h-auto rounded-sm" 
      />
      <span className="text-xs font-bold uppercase">{currentLang.label}</span>
    </button>
  );
}
