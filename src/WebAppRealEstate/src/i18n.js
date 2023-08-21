import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common_en from './translations/en/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: common_en
    }
  },
  keySeparator: false,
  interpolation: { escapeValue: false },
  lng: ['en']
});

export default i18n;
