import request from "request";
import * as fs from "fs-extra";
import chalk from "chalk";
import * as path from "path";
import { PathReporter } from "io-ts/lib/PathReporter";
import { parseCsvComune, decodeComune } from "./utils/comune";

const ELENCO_COMUNI_ITALIANI_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

const parserOption = {
  skip_empty_lines: true,
  delimiter: ";",
  skip_lines_with_error: true,
  from_line: 4,
  trim: true
};

const generateJsonFile = async (record: string[]) => {
  // comune json filename: codice_catastale_lowercase.json
  const comunePath = path.join("comuni", `${record[18].toLowerCase()}.json`);
  const comuneDecoded = decodeComune(record);
  if (comuneDecoded.isRight()) {
    await fs.writeFile(
      path.join(root, comunePath),
      JSON.stringify(comuneDecoded.value)
    );
    console.log(chalk.greenBright(comunePath));
  } else {
    console.log(
      chalk.red(
        "some error occurred while decoding: ",
        record.toString(),
        PathReporter.report(comuneDecoded).join("\n")
      )
    );
  }
};

async function run() {
  console.log(chalk.whiteBright("Comuni builder"));
  const options = {
    url: ELENCO_COMUNI_ITALIANI_URL,
    encoding: "latin1"
  };

  console.log(
    "[1/2] Requesting Comuni data from:",
    chalk.blueBright(ELENCO_COMUNI_ITALIANI_URL)
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
      console.log(chalk.gray("[2/2]"), "Generating comuni JSON...");

      // parse the content string in csv records
      parseCsvComune(csvContent, parserOption, async result => {
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
