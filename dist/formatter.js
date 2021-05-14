"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeAll = exports.capitalize = exports.toFormattedString = exports.ALL_FORMATS = exports.VAT_FORMAT_ES = exports.TOOL_FORMAT = exports.CARD_FORMAT = exports.IDN_FORMAT = exports.IBAN_FORMAT = exports.toFormattedCurrencyAmount = exports.toFormattedDate = exports.toFormattedPercentage = exports.toFormattedFloat = exports.toFormattedInt = exports.toFormattedNumber = exports.getNumberAndUnit = void 0;
const lodash_1 = __importDefault(require("lodash"));
const currency_symbol_map_1 = __importDefault(require("currency-symbol-map"));
const moment_1 = __importDefault(require("moment"));
// ## FORMATTING FUNCTIONS
const DEFAULT_LOCALE = `en`;
// # NUMBER FORMATTING
const DEFAULT_FLOAT_DIGITS = 2;
const UNITS = [``, `K`, `M`, `G`, `T`, `P`, `E`]; // 1, 10^3, 10^6, 10^9, 10^12, 10^15, 10^18
const DEFAULT_START_TO_SHOW_UNIT = 1000;
const NUMBER_FORMAT_DEFAULT_OPTIONS = {
    locale: DEFAULT_LOCALE,
    showUnit: true,
    fallback: undefined,
};
const INT_FORMAT = { maximumFractionDigits: 0 };
const FLOAT_FORMAT = { minimumFractionDigits: DEFAULT_FLOAT_DIGITS, maximumFractionDigits: DEFAULT_FLOAT_DIGITS };
const getNumberAndUnit = (num) => {
    let unitI = 0;
    let rest = num;
    while (rest > DEFAULT_START_TO_SHOW_UNIT && unitI < UNITS.length - 1) {
        rest = rest / DEFAULT_START_TO_SHOW_UNIT;
        unitI++;
    }
    return { numb: rest, unit: UNITS[unitI] };
};
exports.getNumberAndUnit = getNumberAndUnit;
const toFormattedNumber = (num, options) => {
    const hasDecimal = (num % 1 !== 0);
    if (hasDecimal) {
        return exports.toFormattedFloat(num, options);
    }
    return exports.toFormattedInt(num, options);
};
exports.toFormattedNumber = toFormattedNumber;
const toFormattedInt = (num, options) => {
    const formatOptions = lodash_1.default.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, options);
    console.log(formatOptions);
    if (lodash_1.default.isNumber(num) && !lodash_1.default.isNaN(num)) {
        if (formatOptions.showUnit) {
            const { numb, unit } = exports.getNumberAndUnit(num);
            return numb.toLocaleString(formatOptions.locale, INT_FORMAT) + unit;
        }
        console.log(typeof num, num.toLocaleString("es"), num.toLocaleString("eu"), num.toLocaleString("en"), Number(num).toLocaleString("es"));
        return num.toLocaleString(formatOptions.locale, INT_FORMAT);
    }
    return formatOptions.fallback;
};
exports.toFormattedInt = toFormattedInt;
const toFormattedFloat = (num, options) => {
    const formatOptions = lodash_1.default.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, options);
    if (lodash_1.default.isNumber(num) && !lodash_1.default.isNaN(num)) {
        if (formatOptions.showUnit) {
            const { numb, unit } = exports.getNumberAndUnit(num);
            return numb.toLocaleString(formatOptions.locale, FLOAT_FORMAT) + unit;
        }
        return num.toLocaleString(formatOptions.locale, FLOAT_FORMAT);
    }
    return formatOptions.fallback;
};
exports.toFormattedFloat = toFormattedFloat;
const toFormattedPercentage = (num, options) => {
    const formatOptions = lodash_1.default.assign({}, NUMBER_FORMAT_DEFAULT_OPTIONS, { showUnit: false }, options);
    const formattedNumber = exports.toFormattedNumber(num, formatOptions);
    if (!lodash_1.default.isUndefined(formattedNumber)) {
        // TODO: are any special locales? (like toFormattedCurrency)
        return `${formattedNumber}%`;
    }
    return formatOptions.fallback;
};
exports.toFormattedPercentage = toFormattedPercentage;
const DATE_FORMAT_DEFAULT_OPTIONS = {
    pattern: undefined,
    format: `LL`,
    locale: DEFAULT_LOCALE,
    fallback: undefined,
};
const toFormattedDate = (date, options) => {
    const formatOptions = lodash_1.default.assign({}, DATE_FORMAT_DEFAULT_OPTIONS, options);
    try {
        const momentDate = moment_1.default(date, formatOptions.pattern);
        if (!lodash_1.default.isUndefined(date) && momentDate.isValid()) {
            return momentDate.locale(formatOptions.locale).format(formatOptions.format);
        }
    }
    catch (e) { }
    return formatOptions.fallback;
};
exports.toFormattedDate = toFormattedDate;
// # CURRENCY FORMATTING
const DEFAULT_CURRENCY = `eur`;
const CURRENCY_FORMAT_DEFAULT_OPTIONS = {
    currency: DEFAULT_CURRENCY,
    locale: DEFAULT_LOCALE,
    forceFloat: true,
    showUnit: true,
    fallback: undefined,
};
const toFormattedCurrencyAmount = (amount, options) => {
    const formatOptions = lodash_1.default.assign({}, CURRENCY_FORMAT_DEFAULT_OPTIONS, options);
    const parsedAmount = parseFloat(amount);
    if (lodash_1.default.isNumber(parsedAmount) && !lodash_1.default.isNaN(parsedAmount)) {
        let formattedAmount = ``;
        if (formatOptions.forceFloat) {
            formattedAmount = exports.toFormattedFloat(parsedAmount, formatOptions);
        }
        else {
            formattedAmount = exports.toFormattedNumber(parsedAmount, formatOptions);
        }
        const curr = formatOptions.currency;
        const currencySymbol = currency_symbol_map_1.default(curr) || ``;
        switch (curr.toLowerCase()) {
            case `usd`:
                return `${currencySymbol}${formattedAmount}`;
            default:
                return `${formattedAmount}${currencySymbol}`;
        }
    }
    return formatOptions.fallback;
};
exports.toFormattedCurrencyAmount = toFormattedCurrencyAmount;
const STRING_FORMAT_DEFAULT_OPTIONS = {
    pattern: `(.*)`,
    format: `$1`,
};
// string formats
exports.IBAN_FORMAT = {
    pattern: `^(\\w{2}\\d{2})(\\d{4})(\\d{4})(\\d{2})(\\d{10})$`,
    format: `$1 $2 $3 $4 $5`,
};
exports.IDN_FORMAT = {
    pattern: `^(\\d{8})([a-zA-Z])$`,
    format: `$1-$2`,
};
exports.CARD_FORMAT = {
    pattern: `^(\\d{4})(\\d{4})(\\d{4})(\\d{4})$`,
    format: `$1 $2 $3 $4`,
};
exports.TOOL_FORMAT = {
    card: exports.CARD_FORMAT,
};
// https://en.wikipedia.org/wiki/VAT_identification_number#VAT_numbers_by_country
exports.VAT_FORMAT_ES = {
    pattern: `^(\\w)(\\d{7})(\\w)$`,
    format: `$1$2$3`,
};
exports.ALL_FORMATS = [
    exports.IBAN_FORMAT,
    exports.IDN_FORMAT,
    exports.VAT_FORMAT_ES,
    ...Object.values(exports.TOOL_FORMAT),
];
const toFormattedString = (str = ``, ...options) => {
    const formatOptions = (options.length > 0 ? options : exports.ALL_FORMATS).concat(STRING_FORMAT_DEFAULT_OPTIONS);
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
exports.toFormattedString = toFormattedString;
const capitalize = (str = ``) => (str.length > 0) ? (str.charAt(0).toUpperCase() + str.substr(1)) : ``;
exports.capitalize = capitalize;
const capitalizeAll = (str = ``) => (str.length > 0) ? lodash_1.default.join(lodash_1.default.map(str.split(` `), (s) => exports.capitalize(s)), ` `).trim() : ``;
exports.capitalizeAll = capitalizeAll;
