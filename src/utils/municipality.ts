import parse from "csv-parse";
import { Either, left, right } from "fp-ts/lib/Either";
import * as t from "io-ts";
import { Municipality } from "../../definitions/Municipality";

// try to decode municipality csv row in a Municipality object
export const decodeMunicipality = (
  record: ReadonlyArray<string>
): t.Validation<Municipality> => {
  if (record.length < 13) {
    return left([
      {
        context: [],
        value: "record has not the right length"
      }
    ]);
  }
  const municipality = {
    codiceProvincia: record[3],
    codiceRegione: record[0],
    denominazione: record[5],
    denominazioneInItaliano: record[6],
    denominazioneRegione: record[10],
    siglaProvincia: record[13]
  };
  return Municipality.decode(municipality);
};

// try to decode foreign country csv row in a Municipality object
export const decodeForeignCountry = (
  record: ReadonlyArray<string>
): t.Validation<Municipality> => {
  if (record.length < 15) {
    return left([
      {
        context: [],
        value: "record has not the right length"
      }
    ]);
  }
  const municipality = {
    codiceProvincia: "",
    codiceRegione: "",
    denominazione: record[7],
    denominazioneInItaliano: record[6],
    denominazioneRegione: record[4],
    siglaProvincia: ""
  };
  return Municipality.decode(municipality);
};

export type StringMatrix = ReadonlyArray<ReadonlyArray<string>>;
// parse a string into csv records
export const parseCsvMunicipality = (
  content: string,
  parserOption: parse.Options,
  callback: (result: Either<Error, StringMatrix>) => void
) => {
  parse(
    content,
    parserOption,
    (
      err: Error | undefined,
      records: StringMatrix | undefined,
      _: parse.Info
    ) => {
      if (err) {
        callback(left(err));
      }
      callback(right(records as StringMatrix));
    }
  );
};
