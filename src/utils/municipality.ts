import parse from "csv-parse";
import * as t from "io-ts";
import { Either, left, right } from "fp-ts/lib/Either";
import { Municipality } from "../../definitions/Municipality";

// try to decode municipality csv row in a Municipality object
export const decodeMunicipality = (
  record: string[]
): t.Validation<Municipality> => {
  if (record.length < 10) {
    return left([
      {
        context: [],
        value: "record has not the right length"
      }
    ]);
  }
  const municipality = {
    codiceRegione: record[0],
    codiceProvincia: record[3],
    denominazione: record[5],
    denominazioneInItaliano: record[6],
    denominazioneRegione: record[10]
  };
  return Municipality.decode(municipality);
};

// parse a string into csv records
export const parseCsvMunicipality = (
  content: string,
  parserOption: parse.Options,
  callback: (result: Either<Error, string[][]>) => void
) => {
  parse(
    content,
    parserOption,
    (err: Error | undefined, records: any | undefined, _: parse.Info) => {
      if (err) {
        callback(left(err));
      }
      callback(right(records as string[][]));
    }
  );
};
