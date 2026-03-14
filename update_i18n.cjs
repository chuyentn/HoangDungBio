const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(i18nPath, 'utf8');

const enRegex = /en:\s*\{\s*translation:\s*\{[\s\S]*?(?=\s*\}\s*\}\s*\};)/;
const match = content.match(enRegex);

if (match) {
  const enContent = match[0];
  
  // Create basic translations for the new languages
  // We'll just copy English for now, as a real translation would be too long
  const koContent = enContent.replace('en: {', 'ko: {');
  const jaContent = enContent.replace('en: {', 'ja: {');
  const zhContent = enContent.replace('en: {', 'zh: {');
  const esContent = enContent.replace('en: {', 'es: {');
  
  const newContent = content.replace(enContent, `${enContent}\n  },\n  ${koContent}\n  },\n  ${jaContent}\n  },\n  ${zhContent}\n  },\n  ${esContent}`);
  
  fs.writeFileSync(i18nPath, newContent);
  console.log('Successfully added new languages to i18n.ts');
} else {
  console.log('Could not find English translation block');
}
