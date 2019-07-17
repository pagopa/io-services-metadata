import request from "request";
import * as fs from "fs-extra";
import chalk from "chalk";
import * as path from "path";
import * as fse from "fs-extra";
import { PathReporter } from "io-ts/lib/PathReporter";
import { parseCsvMunicipality, decodeMunicipality } from "./utils/municipality";

const ITALIAN_MUNICIPALITIES_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

const parserOption = {
  skip_empty_lines: true,
  delimiter: ";",
  skip_lines_with_error: true,
  from_line: 4,
  trim: true
};

const generateJsonFile = async (record: string[]) => {
  // municipality json filename: codice_catastale_uppercase.json
  const codiceCatastale = record[18].toUpperCase();
  const municipalityPath = path.join(
    "municipalities",
    codiceCatastale.charAt(0),
    codiceCatastale.charAt(1),
    `${codiceCatastale}.json`
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

async function run() {
  console.log(chalk.whiteBright("Municipality builder"));
  const options = {
    url: ITALIAN_MUNICIPALITIES_URL,
    encoding: "latin1"
  };

  console.log(
    "[1/2] Requesting Municipalities data from:",
    chalk.blueBright(ITALIAN_MUNICIPALITIES_URL)
  );
  request.get(
    options,
    async (error: Error, response: request.Response, body: any) => {
      const buffer = Buffer.from(body);

      const csvContent = buffer.toString();
      if (error) {
        console.log(
          "some error occured while retrieving data",
          chalk.red(error.message)
        );
        return;
      }
      console.log(chalk.gray("[2/2]"), "Generating municipalities JSON...");

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
    }
  );
  await Promise.resolve();
}
const root = path.join(__dirname, "../");
run().then(() => console.log("done"), () => process.exit(1));
