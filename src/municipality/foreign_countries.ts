import chalk from "chalk";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs-extra";
import { FOREIGN_COUNTRIES_FILEPATH } from "../config";
import {
  decodeForeignCountry,
  parseCsvMunicipality
} from "../utils/municipality";
import { serializeMunicipalityToJson } from "./serialize_municipality";

const optionCsvParseForeignCountries = {
  delimiter: ";",
  from_line: 3, // skip header + italy entry
  skip_empty_lines: false,
  skip_lines_with_error: false,
  trim: true
};

export const exportForeignMunicipalities = async () => {
  console.log(
    chalk.gray("[1/2]"),
    "Reading foreign countries csv data",
    chalk.blueBright(FOREIGN_COUNTRIES_FILEPATH)
  );
  const csvForeignCountriesContent = fs.readFileSync(
    FOREIGN_COUNTRIES_FILEPATH
  );

  console.log(chalk.gray("[2/2]"), "Generating foreign municipalities JSON...");

  parseCsvMunicipality(
    csvForeignCountriesContent.toString("utf8"),
    optionCsvParseForeignCountries,
    async result => {
      if (E.isLeft(result)) {
        console.log(
          "some error occurred while parsing foreign countries data:",
          chalk.red(result.left.message)
        );
        return;
      }
      const notEmptyData = result.right.filter(r => r[9] !== "");
      // process each csv record with generateForeignCountryJsonFile function
      await Promise.all(
        notEmptyData.map(r => {
          pipe(
          decodeForeignCountry(r), E.map(fc =>
            serializeMunicipalityToJson({
              codiceCatastale: r[9],
              municipality: fc
            })
          ));
        })
      );
    }
  );
};
