import chalk from "chalk";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

export const logError = (error: Error, message?: string) => {
  const log = pipe(
    O.fromNullable(message),
    O.fold(
      () => "",
      x => x
    )
  ).concat(` ${error.message}`);
  console.log(chalk.red(log));
};
