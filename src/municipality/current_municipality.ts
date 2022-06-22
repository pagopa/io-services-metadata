import chalk from "chalk";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import request from "request";
import { ITALIAN_MUNICIPALITIES_URL } from "../config";
import {
  decodeMunicipality,
  parseCsvMunicipality
} from "../utils/municipality";
import { serializeMunicipalityToJson } from "./serialize_municipality";

const parserOption = {
  delimiter: ";",
  from_line: 4,
  skip_empty_lines: true,
  skip_lines_with_error: true,
  trim: true
};

export const exportCurrentMunicipalities = async () => {
  const options = {
    encoding: "latin1",
    url: ITALIAN_MUNICIPALITIES_URL
  };

  console.log(
    chalk.gray("[1/2]"),
    "Requesting Municipalities data from:",
    chalk.blueBright(ITALIAN_MUNICIPALITIES_URL)
  );

  request.get(
    options,
    async (error: Error, _: request.Response, body: unknown) => {
      if (error) {
        console.log(
          "some error occurred while retrieving data",
          chalk.red(error.message)
        );
        return;
      }
      console.log(chalk.gray("[2/2]"), "Generating municipalities JSON...");
      const buffer = Buffer.from(body as ArrayBuffer);

      const csvContent = buffer.toString();
      // parse the content string in csv records
      parseCsvMunicipality(csvContent, parserOption, async result => {
        if (E.isLeft(result)) {
          console.log(
            "some error occurred while parsing data:",
            chalk.red(result.left.message)
          );
          return;
        }
        // process each csv record with generateJsonFiles function
        return Promise.all(
          result.right.map(r => {
            pipe(
              decodeMunicipality(r),
              E.map(municipality =>
                serializeMunicipalityToJson({
                  codiceCatastale: r[19],
                  municipality
                })
              )
            );
          })
        );
      });
    }
  );
};
