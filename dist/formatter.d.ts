export declare type NumberFormatOptionsType = {
    locale?: string;
    fallback?: any;
    showUnit?: any;
};
export declare const getNumberAndUnit: (num: number) => {
    numb: number;
    unit: string;
};
export declare const toFormattedNumber: (num: any, options?: NumberFormatOptionsType | undefined) => any;
export declare const toFormattedInt: (num: any, options?: NumberFormatOptionsType | undefined) => any;
export declare const toFormattedFloat: (num: any, options?: NumberFormatOptionsType | undefined) => any;
export declare const toFormattedPercentage: (num: any, options?: NumberFormatOptionsType | undefined) => any;
export declare type DateFormatOptionsType = {
    pattern?: string;
    format?: string;
    locale?: string;
    fallback?: any;
};
export declare const toFormattedDate: (date: any, options?: DateFormatOptionsType | undefined) => any;
export declare type CurrencyFormatOptionsType = {
    currency?: string;
    locale?: string;
    forceFloat?: boolean;
    showUnit?: boolean;
    fallback?: string;
};
export declare const toFormattedCurrencyAmount: (amount: any, options?: CurrencyFormatOptionsType | undefined) => string | undefined;
export declare type StringFormatOptions = {
    pattern: string;
    format: string;
    fallback?: any;
};
export declare const IBAN_FORMAT: StringFormatOptions;
export declare const IDN_FORMAT: StringFormatOptions;
export declare const CARD_FORMAT: StringFormatOptions;
export declare const TOOL_FORMAT: {
    card: StringFormatOptions;
};
export declare const VAT_FORMAT_ES: StringFormatOptions;
export declare const ALL_FORMATS: StringFormatOptions[];
export declare const toFormattedString: (str?: string, ...options: StringFormatOptions[]) => (string | undefined);
export declare const capitalize: (str?: string) => string;
export declare const capitalizeAll: (str?: string) => string;
