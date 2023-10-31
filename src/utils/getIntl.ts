import arAE from '../intl/ar-AE.json';
import bgBG from '../intl/bg-BG.json';
import csCZ from '../intl/cs-CZ.json';
import daDK from '../intl/da-DK.json';
import deDE from '../intl/de-DE.json';
import elGR from '../intl/el-GR.json';
import enUS from '../intl/en-US.json';
import esES from '../intl/es-ES.json';
import etEE from '../intl/et-EE.json';
import fiFI from '../intl/fi-FI.json';
import frCA from '../intl/fr-CA.json';
import frFR from '../intl/fr-FR.json';
import heIL from '../intl/he-IL.json';
import hrHR from '../intl/hr-HR.json';
import huHU from '../intl/hu-HU.json';
import itIT from '../intl/it-IT.json';
import jaJP from '../intl/ja-JP.json';
import koKR from '../intl/ko-KR.json';
import ltLT from '../intl/lt-LT.json';
import lvLV from '../intl/lv-LV.json';
import nbNO from '../intl/nb-NO.json';
import nlNL from '../intl/nl-NL.json';
import plPL from '../intl/pl-PL.json';
import ptBR from '../intl/pt-BR.json';
import ptPT from '../intl/pt-PT.json';
import roRO from '../intl/ro-RO.json';
import ruRU from '../intl/ru-RU.json';
import skSK from '../intl/sk-SK.json';
import slSI from '../intl/sl-SI.json';
import srSP from '../intl/sr-SP.json';
import svSE from '../intl/sv-SE.json';
import trTR from '../intl/tr-TR.json';
import ukUA from '../intl/uk-UA.json';
import zhCN from '../intl/zh-CN.json';
import zhTW from '../intl/zh-CN.json';

export const locales = {
  'ar-AE': arAE,
  'bg-BG': bgBG,
  'cs-CZ': csCZ,
  'da-DK': daDK,
  'de-DE': deDE,
  'el-GR': elGR,
  'en-US': enUS,
  'es-ES': esES,
  'et-EE': etEE,
  'fi-FI': fiFI,
  'fr-CA': frCA,
  'fr-FR': frFR,
  'he-IL': heIL,
  'hr-HR': hrHR,
  'hu-HU': huHU,
  'it-IT': itIT,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'lt-LT': ltLT,
  'lv-LV': lvLV,
  'nb-NO': nbNO,
  'nl-NL': nlNL,
  'pl-PL': plPL,
  'pt-BR': ptBR,
  'pt-PT': ptPT,
  'ro-RO': roRO,
  'ru-RU': ruRU,
  'sk-SK': skSK,
  'sl-SI': slSI,
  'sr-SP': srSP,
  'sv-SE': svSE,
  'tr-TR': trTR,
  'uk-UA': ukUA,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
} as Record<string, Record<string, string>>;

export type IntlDictionary = Readonly<{
  format: (key: string, value?: Record<string, any>) => string;
}>;

export function getIntl(locale = 'en-US') {
  return Object.freeze({
    format: (key: string, value?: Record<string, any>) => {
      let message = locales?.[locale]?.[key];

      if (!message) {
        throw new Error(
          `Could not find intl message ${key} in ${locale} locale`
        );
      }

      if (value) {
        for (const [prop, replacement] of Object.entries(value)) {
          message = message.replace(`{${prop}}`, String(replacement));
        }
      }

      return message;
    },
  });
}
