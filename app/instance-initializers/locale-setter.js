import ENV from '../config/environment';
import numeral from 'numeral';

export function initialize(instance) {
  var i18n = instance.container.lookup('service:i18n');
  var defaultLocale = ENV.defaultLocale;
  var otherLocale = ENV.otherLocale;

  _.each([defaultLocale, otherLocale], (locale) => {
    i18n.set('locale', locale);
    numeral.language(locale, {
      currency: {
        symbol: i18n.t('currency'),
      },
      delimiters: {
        thousands: i18n.t('thousands_delimiter'),
        decimal: i18n.t('decimal_delmiter')
      },
      abbreviations: {
        thousand: i18n.t('abbr_thousand'),
        million: i18n.t('abbr_million'),
        billion: i18n.t('abbr_billion'),
        trillion: i18n.t('abbr_trillion'),
      }
    });
  });

  i18n.set('defaultLocale', defaultLocale);
  i18n.set('otherLocale', otherLocale);

  i18n.addObserver('locale', function() {
    if(this.get('locale') != 'no-copy') {
      numeral.language(this.get('locale'));
      this.set('display', this.get('locale').split('-')[0]);
    }
  });
}

export default {
  name: 'i18n',
  initialize: initialize
};

