import * as E from "fp-ts/lib/Either";
import {
  decodeForeignCountry,
  decodeMunicipality,
  parseCsvMunicipality
} from "../utils/municipality";

const parserOption = {
  delimiter: ";",
  skip_empty_lines: true,
  trim: true
};

const validMunicipalityRow =
  "12;258;058; 103 ;058103;Subiaco;Subiaco;;3;Centro;Lazio;Roma;0;RM;58103;58103;58103;58103;I992;9.066;ITI;ITI4;ITI43\n";
const validMunicipalityCsvRow: ReadonlyArray<string> = [
  "12",
  "258",
  "058",
  " 103 ",
  "058103",
  "Subiaco",
  "Subiaco",
  "",
  "3",
  "Centro",
  "Lazio",
  "Roma",
  "0",
  "RM",
  "58103",
  "58103",
  "58103",
  "58103",
  "I992",
  "9.066",
  "ITI",
  "ITI4",
  "ITI43"
];

const validForeignCountryCsvRow: ReadonlyArray<string> = [
  "S",
  "5",
  "Oceania",
  "50",
  "Oceania",
  "719",
  "Nuova Zelanda",
  "New Zealand",
  "719",
  "Z719",
  "554",
  "NZ",
  "NZL",
  "",
  ""
];

const invalidMunicipalityCsvRow: ReadonlyArray<string> = [
  "12",
  "258",
  "058",
  " 103 "
];

describe("parse csv string", () => {
  it("should return a valid record", () => {
    parseCsvMunicipality(validMunicipalityRow, parserOption, result => {
      expect(E.isRight(result)).toBeTruthy();
    });
  });

  it("should return a valid record with expected size and values", () => {
    parseCsvMunicipality(validMunicipalityRow, parserOption, result => {
      expect(E.isRight(result)).toBeTruthy();
      if (E.isRight(result)) {
        expect(result.right.length).toEqual(1);
        expect(result.right[0].length).toEqual(23);
        expect(result.right[0][5]).toEqual("Subiaco");
      }
    });
  });
});

describe("decode Municipality", () => {
  it("should recognize a valid Municipality csv row", () => {
    const validMunicipality = decodeMunicipality(validMunicipalityCsvRow);
    expect(E.isRight(validMunicipality)).toBeTruthy();
    if (E.isRight(validMunicipality)) {
      expect(validMunicipality.right.denominazioneInItaliano).toEqual(
        "Subiaco"
      );
    }
  });

  it("should recognize a valid Foreign Country csv row", () => {
    const validForeignCountry = decodeForeignCountry(validForeignCountryCsvRow);
    expect(E.isRight(validForeignCountry)).toBeTruthy();
    if (E.isRight(validForeignCountry)) {
      expect(validForeignCountry.right.denominazioneInItaliano).toEqual(
        "Nuova Zelanda"
      );
    }
  });

  it("should recognize an invalid Municipality row (wrong length)", () => {
    const validMunicipality = decodeMunicipality(invalidMunicipalityCsvRow);
    expect(E.isLeft(validMunicipality)).toBeTruthy();
  });
});
