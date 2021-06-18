import chalk from "chalk";
import { fromNullable } from "../../node_modules/fp-ts/lib/Option";

export const logError = (error: Error, message?: string) => {
  const log = fromNullable(message)
    .fold("", x => x)
    .concat(` ${error.message}`);
  console.log(chalk.red(log));
};
