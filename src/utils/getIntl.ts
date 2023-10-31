export const locales = [
  'ar-AE',
  'bg-BG',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'el-GR',
  'en-US',
  'es-ES',
  'et-EE',
  'fi-FI',
  'fr-FR',
  'he-IL',
  'hr-HR',
  'hu-HU',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'lt-LT',
  'lv-LV',
  'nb-NO',
  'nl-NL',
  'pl-PL',
  'pt-BR',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sk-SK',
  'sl-SI',
  'sr-SP',
  'sv-SE',
  'tr-TR',
  'uk-UA',
  'zh-CN',
  'zh-TW',
];

let dictionary: Record<string, Record<string, string>>;

export type IntlDictionary = Readonly<{
  format: (key: string, value?: Record<string, any>) => string;
}>;

export function getIntl(locale = 'en-US') {
  return Object.freeze({
    format: (key: string, value?: Record<string, any>) => {
      if (!dictionary) {
        const reduceIntl = (acc: typeof dictionary, isoCountry: string) => ({
          ...acc,
          [isoCountry]: require(`../intl/${isoCountry}.json`),
        });

        dictionary = locales.reduce(reduceIntl, {});
      }

      let message = dictionary?.[locale]?.[key];

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
