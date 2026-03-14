const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

// The previous script probably messed up the brackets. Let's fix it.
// We'll just replace the whole file with a cleaner version.

const enRegex = /en:\s*\{\s*translation:\s*\{[\s\S]*?(?=\s*\}\s*\}\s*\};)/;
const match = content.match(enRegex);

if (match) {
  const enContent = match[0];
  const viContent = content.substring(content.indexOf('vi: {'), content.indexOf('en: {'));
  
  const koContent = enContent.replace('en: {', 'ko: {');
  const jaContent = enContent.replace('en: {', 'ja: {');
  const zhContent = enContent.replace('en: {', 'zh: {');
  const esContent = enContent.replace('en: {', 'es: {');
  
  const newContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ${viContent}
  ${enContent}
  },
  ${koContent}
  },
  ${jaContent}
  },
  ${zhContent}
  },
  ${esContent}
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
`;
  
  fs.writeFileSync(i18nPath, newContent);
  console.log('Successfully fixed i18n.ts');
} else {
  console.log('Could not find English translation block');
}
