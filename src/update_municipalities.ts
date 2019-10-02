import chalk from "chalk";
import * as fs from "fs-extra";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as path from "path";
import request from "request";
import { Municipality } from "../definitions/Municipality";
import { CodiceCatastale } from "./types/MunicipalityCodiceCatastale";
import {
  decodeForeignCountry,
  decodeMunicipality,
  parseCsvMunicipality
} from "./utils/municipality";

const ITALIAN_MUNICIPALITIES_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

const FOREIGN_COUNTRIES_FILEPATH =
  "data/Elenco-codici-e-denominazioni-al-31_12_2018.csv";

const parserOption = {
  delimiter: ";",
  from_line: 4,
  skip_empty_lines: true,
  skip_lines_with_error: true,
  trim: true
};
const optionCsvParseForeignCountries = {
  delimiter: ";",
  from_line: 3, // skip header + italy entry
  skip_empty_lines: false,
  skip_lines_with_error: false,
  trim: true
};
const root = path.join(__dirname, "../");

const generateJsonFile = async (
  record: ReadonlyArray<string>,
  codiceCatastale: string,
  decoder: (record: ReadonlyArray<string>) => t.Validation<Municipality>
) => {
  // municipality json filename: codice_catastale_uppercase.json
  const mayBeCodiceCatastale = CodiceCatastale.decode(codiceCatastale);
  if (mayBeCodiceCatastale.isLeft()) {
    console.log(chalk.red("invalid Codice Catastale ", codiceCatastale));
    return;
  }
  const codiceCatastaleValue = mayBeCodiceCatastale.value;
  // json path for L513 codice catastale:
  // municipalities/L/5/L513.json
  const municipalityPath = path.join(
    "municipalities",
    codiceCatastaleValue.charAt(0),
    codiceCatastaleValue.charAt(1),
    `${codiceCatastaleValue}.json`
  );
  const municipalityDecoded = decoder(record);
  if (municipalityDecoded.isRight()) {
    try {
      await fs.outputFile(
        path.join(root, municipalityPath),
        JSON.stringify(municipalityDecoded.value)
      );
      console.log(chalk.greenBright(municipalityPath));
    } catch {
      console.log(
        chalk.red("some error occurred while writing file: ", municipalityPath)
      );
    }
  } else {
    console.log(
      chalk.red(
        "some error occurred while decoding: ",
        record.toString(),
        PathReporter.report(municipalityDecoded).join("\n")
      )
    );
  }
};

async function run(): Promise<void> {
  console.log(chalk.whiteBright("Municipality builder"));
  const options = {
    encoding: "latin1",
    url: ITALIAN_MUNICIPALITIES_URL
  };

  console.log(
    "[1/4] Requesting Municipalities data from:",
    chalk.blueBright(ITALIAN_MUNICIPALITIES_URL)
  );

  // tslint:disable-next-line: no-any
  request.get(options, async (error: Error, _: request.Response, body: any) => {
    if (error) {
      console.log(
        "some error occured while retrieving data",
        chalk.red(error.message)
      );
      return;
    }
    console.log(chalk.gray("[2/4]"), "Generating municipalities JSON...");
    const buffer = Buffer.from(body);

    const csvContent = buffer.toString();
    // parse the content string in csv records
    parseCsvMunicipality(csvContent, parserOption, async result => {
      if (result.isLeft()) {
        console.log(
          "some error occured while parsing data:",
          chalk.red(result.value.message)
        );
        return;
      }
      // process each csv record with generateJsonFiles function
      await Promise.all(
        result.value.map(r => generateJsonFile(r, r[18], decodeMunicipality))
      );
    });
  });

  // parsing foreign countries data
  console.log(
    "[3/4] Reading foreign countries csv data",
    chalk.blueBright(FOREIGN_COUNTRIES_FILEPATH)
  );
  const csvForeignCountriesContent = fs.readFileSync(
    FOREIGN_COUNTRIES_FILEPATH
  );
  parseCsvMunicipality(
    csvForeignCountriesContent.toString(),
    optionCsvParseForeignCountries,
    async result => {
      if (result.isLeft()) {
        console.log(
          "some error occured while parsing foreign countries data:",
          chalk.red(result.value.message)
        );
        return;
      }
      const notEmptyData = result.value.filter(r => r[9] !== "");
      // process each csv record with generateForeignCountryJsonFile function
      await Promise.all(
        notEmptyData.map(r => generateJsonFile(r, r[9], decodeForeignCountry))
      );
    }
  );
  await Promise.resolve();
}

run().then(() => console.log("done"), () => process.exit(1));
