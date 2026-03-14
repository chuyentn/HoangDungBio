const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

// The regex approach is failing because of nested objects. Let's just use JSON parsing.
// We'll extract the vi and en objects, then create the others.

const viStart = content.indexOf('vi: {');
const enStart = content.indexOf('en: {');
const endOfEn = content.lastIndexOf('};');

const viContentStr = content.substring(viStart, enStart).trim();
const enContentStr = content.substring(enStart, endOfEn).trim();

// The enContentStr might have extra closing braces at the end. Let's clean it up.
let cleanEnContentStr = enContentStr;
while (cleanEnContentStr.endsWith('}') || cleanEnContentStr.endsWith(',')) {
  cleanEnContentStr = cleanEnContentStr.substring(0, cleanEnContentStr.length - 1).trim();
}

// Now cleanEnContentStr should be `en: { ... }`
// Let's make sure it ends with `}`
if (!cleanEnContentStr.endsWith('}')) {
  cleanEnContentStr += '}';
}

const koContent = cleanEnContentStr.replace('en: {', 'ko: {');
const jaContent = cleanEnContentStr.replace('en: {', 'ja: {');
const zhContent = cleanEnContentStr.replace('en: {', 'zh: {');
const esContent = cleanEnContentStr.replace('en: {', 'es: {');

const newContent = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ${viContentStr}
  ${cleanEnContentStr},
  ${koContent},
  ${jaContent},
  ${zhContent},
  ${esContent}
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
console.log('Successfully fixed i18n.ts with JSON-like parsing');
