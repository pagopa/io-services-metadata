import parse from "csv-parse";
import * as t from "io-ts";
import { Either, left, right } from "fp-ts/lib/Either";
import { Comune } from "../../definitions/Comune";

// try to decode comune csv row in a Comune object
export const decodeComune = (record: string[]): t.Validation<Comune> => {
  if (record.length < 10) {
    return left([
      {
        context: [],
        value: "record has not the right length"
      }
    ]);
  }
  const comune = {
    codiceRegione: record[0],
    codiceProvincia: record[3],
    denominazione: record[5],
    denominazioneInItaliano: record[6],
    denominazioneRegione: record[10]
  };
  return Comune.decode(comune);
};

// parse a string into csv records
export const parseCsvComune = (
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
