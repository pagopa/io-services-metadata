import parse from "csv-parse";
import { StringMatrix } from "./municipality";

export const parseCsvPromise = (
  content: string,
  options: parse.Options
): Promise<StringMatrix> => {
  return new Promise((resolve, reject) => {
    parse(
      content,
      options,
      (err: Error | undefined, records: StringMatrix | undefined) => {
        if (err) {
          return reject(err);
        }
        resolve(records);
      }
    );
  });
};
