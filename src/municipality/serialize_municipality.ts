import { CodiceCatastale } from "../types/MunicipalityCodiceCatastale";
import chalk from "chalk";
import * as fs from "fs-extra";
import path from "path";
import { MUNICIPALITIES_OUTPUT_FOLDER_NAME, ROOT } from "../config";
import { SerializableMunicipality } from "../types/SerializableMunicipality";

/*
  Calculate the path where to save the municipality entity.
  For example, json path for L513 codice catastale:
  `municipalities/L/5/L513.json
 */
const calculateMunicipalityPath = (codiceCatastale: string) => {
  return path.join(
    MUNICIPALITIES_OUTPUT_FOLDER_NAME,
    codiceCatastale.charAt(0),
    codiceCatastale.charAt(1),
    `${codiceCatastale}.json`
  );
};

export const serializeMunicipalityToJson = async (
  serializableMunicipality: SerializableMunicipality
) => {
  // municipality json filename: codice_catastale_uppercase.json
  const mayBeCodiceCatastale = CodiceCatastale.decode(
    serializableMunicipality.codiceCatastale
  );
  if (mayBeCodiceCatastale.isLeft()) {
    console.log(
      chalk.red(
        "invalid Codice Catastale ",
        serializableMunicipality.codiceCatastale
      )
    );
    return;
  }
  const codiceCatastaleValue = mayBeCodiceCatastale.value;
  const municipalityPath = calculateMunicipalityPath(codiceCatastaleValue);

  try {
    await fs.outputFile(
      path.join(ROOT, municipalityPath),
      JSON.stringify(serializableMunicipality.municipality)
    );
    console.log(chalk.greenBright(municipalityPath));
  } catch {
    console.log(
      chalk.red("some error occurred while writing file: ", municipalityPath)
    );
  }
};
