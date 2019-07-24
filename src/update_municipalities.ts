import chalk from "chalk";
import * as fs from "fs-extra";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as path from "path";
import request from "request";
import { CodiceCatastale } from "./types/MunicipalityCodiceCatastale";
import { decodeMunicipality, parseCsvMunicipality } from "./utils/municipality";

const ITALIAN_MUNICIPALITIES_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

const parserOption = {
  delimiter: ";",
  from_line: 4,
  skip_empty_lines: true,
  skip_lines_with_error: true,
  trim: true
};
const root = path.join(__dirname, "../");

const generateJsonFile = async (record: ReadonlyArray<string>) => {
  // municipality json filename: codice_catastale_uppercase.json
  const codiceCatastale = CodiceCatastale.decode(record[18].toUpperCase());
  if (codiceCatastale.isLeft()) {
    console.log(
      chalk.red("invalid Codice Catastale ", record[18].toUpperCase())
    );
    return;
  }
  const codiceCatastaleValue = codiceCatastale.value;
  // json path for L513 codice catastale:
  // municipalities/L/5/L513.json
  const municipalityPath = path.join(
    "municipalities",
    codiceCatastaleValue.charAt(0),
    codiceCatastaleValue.charAt(1),
    `${codiceCatastaleValue}.json`
  );
  const municipalityDecoded = decodeMunicipality(record);
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
    "[1/2] Requesting Municipalities data from:",
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
    console.log(chalk.gray("[2/2]"), "Generating municipalities JSON...");
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
      await Promise.all(result.value.map(generateJsonFile));
    });
  });
  await Promise.resolve();
}

run().then(() => console.log("done"), () => process.exit(1));
