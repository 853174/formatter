import _ from "lodash";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";

// ## FORMATTING FUNCTIONS

const DEFAULT_LOCALE = `en`;

// # NUMBER FORMATTING

const DEFAULT_FLOAT_DIGITS = 2;
const UNITS = [``, `K`, `M`, `G`, `T`, `P`, `E`]; // 1, 10^3, 10^6, 10^9, 10^12, 10^15, 10^18
const DEFAULT_START_TO_SHOW_UNIT = 1000;

export type NumberFormatOptionsType = { locale?: string, fallback?: any, showUnit?: any };

const NUMBER_FORMAT_DEFAULT_OPTIONS = {
  locale: DEFAULT_LOCALE,
  showUnit: true,
  fallback: undefined,
};

const INT_FORMAT = { maximumFractionDigits: 0 };
const FLOAT_FORMAT = { minimumFractionDigits: DEFAULT_FLOAT_DIGITS, maximumFractionDigits: DEFAULT_FLOAT_DIGITS };

export const getNumberAndUnit = (num: number) => {
  let unitI = 0;
  let rest = num;
  while (rest > DEFAULT_START_TO_SHOW_UNIT && unitI < UNITS.length - 1) {
    rest = rest / DEFAULT_START_TO_SHOW_UNIT;
    unitI++;
  }
  return { numb: rest, unit: UNITS[unitI] };
};

export const toFormattedNumber = (num: any, options?: NumberFormatOptionsType) => {
  const hasDecimal = (num % 1 !== 0);
  if (hasDecimal) {
    return toFormattedFloat(num, options);
  }
  return toFormattedInt(num, options);
};

export const toFormattedInt = (num: any, options?: NumberFormatOptionsType) => {
  const formatOptions = _.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, options);
  console.log(formatOptions);
  if (_.isNumber(num) && !_.isNaN(num)) {
    if (formatOptions.showUnit) {
      const { numb, unit } = getNumberAndUnit(num);
      return numb.toLocaleString(formatOptions.locale, INT_FORMAT) + unit;
    }
    console.log(typeof num, num.toLocaleString("es"), num.toLocaleString("eu"), num.toLocaleString("en"), Number(num).toLocaleString("es"))
    return num.toLocaleString(formatOptions.locale, INT_FORMAT);
  }
  return formatOptions.fallback;
};

export const toFormattedFloat = (num: any, options?: NumberFormatOptionsType) => {
  const formatOptions = _.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, options);
  if (_.isNumber(num) && !_.isNaN(num)) {
    if (formatOptions.showUnit) {
      const { numb, unit } = getNumberAndUnit(num);
      return numb.toLocaleString(formatOptions.locale, FLOAT_FORMAT) + unit;
    }
    return num.toLocaleString(formatOptions.locale, FLOAT_FORMAT);
  }
  return formatOptions.fallback;
};

export const toFormattedPercentage = (num: any, options?: NumberFormatOptionsType) => {
  const formatOptions = _.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, { showUnit: false }, options);
  const formattedNumber = toFormattedNumber(num, formatOptions);
  if (!_.isUndefined(formattedNumber)) {
    // TODO: are any special locales? (like toFormattedCurrency)
    return `${formattedNumber}%`;
  }

  return formatOptions.fallback;
};

// # DATE FORMATTING

export type DateFormatOptionsType = { pattern?: string, format?: string, locale?: string, fallback?: any };
const DATE_FORMAT_DEFAULT_OPTIONS = {
  pattern: undefined,
  format: `LL`,
  locale: DEFAULT_LOCALE,
  fallback: undefined,
};
export const toFormattedDate = (date: any, options?: DateFormatOptionsType) => {
  const formatOptions = _.assign({}, DATE_FORMAT_DEFAULT_OPTIONS, options);

  try {
    const momentDate = moment(date, formatOptions.pattern);
    if (!_.isUndefined(date) && momentDate.isValid()) {
      return momentDate.locale(formatOptions.locale).format(formatOptions.format);
    }
  } catch (e) {
    return formatOptions.fallback;
  }

  return formatOptions.fallback;
};

// # CURRENCY FORMATTING

const DEFAULT_CURRENCY = `eur`;
export type CurrencyFormatOptionsType = { currency?: string, locale?: string, forceFloat?: boolean, showUnit?: boolean, fallback?: string };
const CURRENCY_FORMAT_DEFAULT_OPTIONS = {
  currency: DEFAULT_CURRENCY,
  locale: DEFAULT_LOCALE,
  forceFloat: true,
  showUnit: true,
  fallback: undefined,
};
export const toFormattedCurrencyAmount = (amount: any, options?: CurrencyFormatOptionsType) => {

  const formatOptions = _.assign({}, CURRENCY_FORMAT_DEFAULT_OPTIONS, options);
  const parsedAmount = parseFloat(amount);

  if (_.isNumber(parsedAmount) && !_.isNaN(parsedAmount)) {
    let formattedAmount = ``;
    if (formatOptions.forceFloat) {
      formattedAmount = toFormattedFloat(parsedAmount, formatOptions);
    } else {
      formattedAmount = toFormattedNumber(parsedAmount, formatOptions);
    }

    const curr = formatOptions.currency;
    const currencySymbol = getSymbolFromCurrency(curr) || ``;

    switch (curr.toLowerCase()) {
      case `usd`:
        return `${currencySymbol}${formattedAmount}`;
      default:
        return `${formattedAmount}${currencySymbol}`;
    }
  }

  return formatOptions.fallback;
};

// # STRING FORMATTING
export type StringFormatOptions = {
  pattern: string;
  format: string;
  fallback?: any;
};

const STRING_FORMAT_DEFAULT_OPTIONS: StringFormatOptions = {
  pattern: `(.*)`,
  format: `$1`,
};

// string formats
export const IBAN_FORMAT: StringFormatOptions = {
  pattern: `^(\\w{2}\\d{2})(\\d{4})(\\d{4})(\\d{2})(\\d{10})$`,
  format: `$1 $2 $3 $4 $5`,
};

export const IDN_FORMAT: StringFormatOptions = {
  pattern: `^(\\d{8})([a-zA-Z])$`,
  format: `$1-$2`,
};

export const CARD_FORMAT: StringFormatOptions = {
  pattern: `^(\\d{4})(\\d{4})(\\d{4})(\\d{4})$`,
  format: `$1 $2 $3 $4`,
};

export const TOOL_FORMAT = {
  card: CARD_FORMAT,
};

// https://en.wikipedia.org/wiki/VAT_identification_number#VAT_numbers_by_country
export const VAT_FORMAT_ES: StringFormatOptions = {
  pattern: `^(\\w)(\\d{7})(\\w)$`,
  format: `$1$2$3`,
};

export const ALL_FORMATS = [
  IBAN_FORMAT,
  IDN_FORMAT,
  VAT_FORMAT_ES,
  ...Object.values(TOOL_FORMAT),
];

export const toFormattedString = (str = ``, ...options: StringFormatOptions[]): (string | undefined) => {
  const formatOptions = (options.length > 0 ? options : ALL_FORMATS).concat(STRING_FORMAT_DEFAULT_OPTIONS);

  for (const option of formatOptions) {
    let tryResult = option.format;
    const matches = str.match(option.pattern);
    if (matches) {
      let i = 0;
      for (const match of matches) {
        tryResult = tryResult.replaceAll(`$${i}`, match);
        i++;
      }

      return tryResult;
    }

    if (option.fallback) {
      return option.fallback;
    }
  }

  return undefined;
};

export const capitalize = (str = ``): string =>
  (str.length > 0) ? (str.charAt(0).toUpperCase() + str.substr(1)) : ``;

export const capitalizeAll = (str = ``): string =>
  (str.length > 0) ? _.join(_.map(str.split(` `), (s: string) => capitalize(s)), ` `).trim() : ``;
