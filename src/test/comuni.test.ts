import { parseCsvComune, decodeComune } from "../utils/comune";

const parserOption = {
  skip_empty_lines: true,
  delimiter: ";",
  trim: true
};

const validComuneRow =
  "12;258;058; 103 ;058103;Subiaco;Subiaco;;3;Centro;Lazio;Roma;0;RM;58103;58103;58103;58103;I992;9.066;ITI;ITI4;ITI43\n";
const validComuneCsvRow = [
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

const invalidComuneCsvRow = ["12", "258", "058", " 103 "];

describe("should parse csv Comune", () => {
  it("should return a valid record", () => {
    parseCsvComune(validComuneRow, parserOption, result => {
      expect(result.isRight()).toBeTruthy();
    });
  });

  it("should return a valid record with expected size and values", () => {
    parseCsvComune(validComuneRow, parserOption, result => {
      expect(result.isRight()).toBeTruthy();
      if (result.isRight()) {
        expect(result.value.length).toEqual(1);
        expect(result.value[0].length).toEqual(23);
        expect(result.value[0][5]).toEqual("Subiaco");
      }
    });
  });
});

describe("decode Comune", () => {
  it("should recognize a valid Comune csv row", () => {
    const validComune = decodeComune(validComuneCsvRow);
    expect(validComune.isRight()).toBeTruthy();
    if (validComune.isRight()) {
      expect(validComune.value.denominazioneInItaliano).toEqual("Subiaco");
    }
  });

  it("should recognize an invalid Comune row (wrong length)", () => {
    const validComune = decodeComune(invalidComuneCsvRow);
    expect(validComune.isLeft()).toBeTruthy();
  });
});
