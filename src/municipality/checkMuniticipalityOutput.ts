import chalk from "chalk";
import * as E from "fp-ts/lib/Either";
import * as fs from "fs-extra";
// eslint-disable-next-line import/order
import * as path from "path";
import { Municipality } from "../../generated/definitions/content/Municipality";
import { MUNICIPALITIES_OUTPUT_FOLDER } from "../config";

// walk recursively inside all paths in dir and return the list of files met
const walkSync = (dir: string): ReadonlyArray<string> => {
  const files = fs.readdirSync(dir);
  return files.reduce((aggr: ReadonlyArray<string>, curr: string) => {
    const currentPath = path.join(dir, curr);
    if (fs.statSync(currentPath).isDirectory()) {
      return [...aggr, ...walkSync(currentPath)];
    }
    return [...aggr, currentPath];
  }, []);
};

/**
 * check if all json produced in the output folder are right encoded
 */
export const checkMunicipalityOutput = () => {
  const jsons = walkSync(MUNICIPALITIES_OUTPUT_FOLDER).filter(j => {
    try {
      const obj = JSON.parse(fs.readFileSync(j).toString());
      return E.isLeft(Municipality.decode(obj));
    } catch {
      return true;
    }
  });
  jsons.forEach(invalid => {
    console.log(chalk.red(`${invalid} is not a valid Municipality`));
  });
};
