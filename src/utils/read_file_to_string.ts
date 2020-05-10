import { Either, left, right } from "fp-ts/lib/Either";
import * as fs from "fs-extra";

export const readFileToString = (path: string): Either<Error, string> => {
  try {
    return right(fs.readFileSync(path).toString("utf8"));
  } catch (e) {
    return left(new Error(String(e)));
  }
};
