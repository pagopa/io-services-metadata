import chalk from "chalk";
import * as fs from "fs-extra";
import {
  decodeForeignCountry,
  parseCsvMunicipality
} from "../utils/municipality";
import { FOREIGN_COUNTRIES_FILEPATH } from "../config";
import { SerializableMunicipality } from "../types/SerializableMunicipality";
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
    "[3/4] Reading foreign countries csv data",
    chalk.blueBright(FOREIGN_COUNTRIES_FILEPATH)
  );
  const csvForeignCountriesContent = fs.readFileSync(
    FOREIGN_COUNTRIES_FILEPATH
  );
  parseCsvMunicipality(
    csvForeignCountriesContent.toString("utf8"),
    optionCsvParseForeignCountries,
    async result => {
      if (result.isLeft()) {
        console.log(
          "some error occurred while parsing foreign countries data:",
          chalk.red(result.value.message)
        );
        return;
      }
      const notEmptyData = result.value.filter(r => r[9] !== "");
      // process each csv record with generateForeignCountryJsonFile function
      await Promise.all(
        notEmptyData.map(r => {
          decodeForeignCountry(r).map(fc =>
            serializeMunicipalityToJson({
              municipality: fc,
              codiceCatastale: r[9]
            })
          );
        })
      );
    }
  );
};
