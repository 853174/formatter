import { expect } from "chai";
import { toFormattedDate, toFormattedFloat, toFormattedInt, toFormattedNumber } from "../src/formatter"

describe("format numbers whit toFormattedInt(...)", () => {

  it("should return a formatted Integer with unit (locale = en)", () => {
    const n = 3000;
    const f = toFormattedInt(n);
    expect(f).is.equal("3K");
  });

  it("should return a formatted Integer without unit (locale = en)", () => {
    const n = 3000;
    const f = toFormattedInt(n, { showUnit: false });
    expect(f).is.equal("3,000");
  });

  it("should return a formatted Integer without unit (locale = es)", () => {
    const n = 3000;
    const f = toFormattedInt(n, { showUnit: false, locale: "es" });
    expect(f).is.equal("3.000");
  });

  it("should return undefined with invalid number", () => {
    const n = "invalid number";
    const f = toFormattedInt(n);
    expect(f).is.equal(undefined);
  });

  it("should return fallback with invalid number and fallback configuration", () => {
    const n = "invalid number";
    const fallback = "fallback";
    const f = toFormattedInt(n, { fallback: fallback });
    expect(f).is.equal(fallback);
  });
});

describe("format numbers whit toFormattedFloat(...)", () => {

  it("should return a formatted Float with unit (locale = en)", () => {
    const n = 3000.96215;
    const f = toFormattedFloat(n);
    expect(f).is.equal("3.00K");
  });

  it("should return a formatted Float without unit (locale = en)", () => {
    const n = 3000.96215;
    const f = toFormattedFloat(n, { showUnit: false });
    expect(f).is.equal("3,000.96");
  });

  it("should return a formatted Float without unit (locale = es)", () => {
    const n = 3000.96215;
    const f = toFormattedFloat(n, { showUnit: false, locale: "es" });
    expect(f).is.equal("3.000,96");
  });

  it("should return undefined with invalid float", () => {
    const n = "invalid float";
    const f = toFormattedFloat(n);
    expect(f).is.equal(undefined);
  });

  it("should return fallback with invalid number and fallback configuration", () => {
    const n = "invalid number";
    const fallback = "fallback";
    const f = toFormattedFloat(n, { fallback: fallback });
    expect(f).is.equal(fallback);
  });

  it("should return a formatted Integer with unit (locale = en)", () => {
    const n = 3000;
    const f = toFormattedNumber(n);
    expect(f).is.equal("3K");
  })

  it("should return a formatted Float with unit (locale = en)", () => {
    const n = 3000.53;
    const f = toFormattedNumber(n);
    expect(f).is.equal("3.00K");
  })
});

describe("format numbers whit toFormattedNumber(...)", () => {

  it("should return a formatted Integer with unit (locale = en)", () => {
    const n = 3000;
    const f = toFormattedNumber(n);
    expect(f).is.equal("3K");
  })

  it("should return a formatted Float with unit (locale = en)", () => {
    const n = 3000.53;
    const f = toFormattedNumber(n);
    expect(f).is.equal("3.00K");
  })
});

describe("format dates with toFormattedDate(...)", () => {

  it("sholud return a localized date from ISO date string (YYYY-MM-DD) (locale = en)", () => {
    const d = "2021-05-14";
    const f = toFormattedDate(d);
    expect(f).is.equal("May 14, 2021");
  })

  it("sholud return a localized date from ISO date string (YYYY-MM-DD) (locale = es)", () => {
    const d = "2021-05-14";
    const f = toFormattedDate(d, { locale: "es" });
    expect(f).is.equal("14 de mayo de 2021");
  })

  it("sholud return a localized date from custom date string (locale = en)", () => {
    const d = "14/05/2021";
    const f = toFormattedDate(d, { pattern: `DD/MM/YYYY` });
    expect(f).is.equal("May 14, 2021");
  })

  it("sholud return a localized date from timestamp (miliseconds) (locale = en)", () => {
    const d = 1620988793207;
    const f = toFormattedDate(d);
    expect(f).is.equal("May 14, 2021");
  })

  it("sholud return a custom formatted date from ISO date string (YYYY-MM-DD) (locale = en)", () => {
    const d = "2021-05-14";
    const format = "DD/MM/YYYY";
    const f = toFormattedDate(d, { format: format });
    expect(f).is.equal("14/05/2021");
  })

  it("sholud return a custom formatted date from ISO date string (YYYY-MM-DD) (locale = es)", () => {
    const d = "2021-05-14";
    const format = "DD/MM/YYYY";
    const f = toFormattedDate(d, { locale: "es", format: format });
    expect(f).is.equal("14/05/2021");
  })

  it("sholud return a custom formatted date from custom date string (locale = en)", () => {
    const d = "14/05/2021";
    const format = "DD/MM/YYYY";
    const f = toFormattedDate(d, { pattern: `DD/MM/YYYY`, format: format });
    expect(f).is.equal("14/05/2021");
  })

  it("sholud return a custom formatted date from timestamp (miliseconds) (locale = en)", () => {
    const d = 1620988793207;
    const format = "DD/MM/YYYY";
    const f = toFormattedDate(d, { format: format });
    expect(f).is.equal("14/05/2021");
  })

  it("sholud return undefined with invalid date (locale = en)", () => {
    const d = "invalid date";
    const f = toFormattedDate(d);
    expect(f).is.equal(undefined);
  })

  it("sholud return fallback with invalid date (locale = en)", () => {
    const d = "invalid date";
    const fallback = "fallback";
    const f = toFormattedDate(d, { fallback: fallback });
    expect(f).is.equal(fallback);
  })
})