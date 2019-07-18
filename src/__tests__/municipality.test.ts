import {
  parseCsvMunicipality,
  decodeMunicipality
} from "../utils/municipality";

const parserOption = {
  skip_empty_lines: true,
  delimiter: ";",
  trim: true
};

const validMunicipalityRow =
  "12;258;058; 103 ;058103;Subiaco;Subiaco;;3;Centro;Lazio;Roma;0;RM;58103;58103;58103;58103;I992;9.066;ITI;ITI4;ITI43\n";
const validMunicipalityCsvRow = [
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

const invalidMunicipalityCsvRow = ["12", "258", "058", " 103 "];

describe("parse csv string", () => {
  it("should return a valid record", () => {
    parseCsvMunicipality(validMunicipalityRow, parserOption, result => {
      expect(result.isRight()).toBeTruthy();
    });
  });

  it("should return a valid record with expected size and values", () => {
    parseCsvMunicipality(validMunicipalityRow, parserOption, result => {
      expect(result.isRight()).toBeTruthy();
      if (result.isRight()) {
        expect(result.value.length).toEqual(1);
        expect(result.value[0].length).toEqual(23);
        expect(result.value[0][5]).toEqual("Subiaco");
      }
    });
  });
});

describe("decode Municipality", () => {
  it("should recognize a valid Municipality csv row", () => {
    const validMunicipality = decodeMunicipality(validMunicipalityCsvRow);
    expect(validMunicipality.isRight()).toBeTruthy();
    if (validMunicipality.isRight()) {
      expect(validMunicipality.value.denominazioneInItaliano).toEqual(
        "Subiaco"
      );
    }
  });

  it("should recognize an invalid Municipality row (wrong length)", () => {
    const validMunicipality = decodeMunicipality(invalidMunicipalityCsvRow);
    expect(validMunicipality.isLeft()).toBeTruthy();
  });
});
