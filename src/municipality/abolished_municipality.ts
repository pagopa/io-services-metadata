import * as fs from "fs-extra";
import {
  ABOLISHED_MUNICIPALITIES_FILEPATH,
  MUNICIPALITIES_CATASTALI_FILEPATH
} from "../config";
import { parseCsvPromise } from "../utils/parse_csv_promise";
import { AbolishedMunicipality } from "../types/AbolishedMunicipality";
import { SerializableMunicipality } from "../types/SerializableMunicipality";
import { tryCatch2v } from "../../node_modules/fp-ts/lib/Either";
import * as t from "io-ts";
import { serializeMunicipalityToJson } from "./serialize_municipality";
import chalk from "chalk";

const optionMunicipalitiesWithCatastale = {
  delimiter: ",",
  from_line: 1,
  skip_empty_lines: true,
  skip_lines_with_error: true,
  trim: true
};

/**
 * This function export the data of the abolished municipalities, creating the data starting from two dataset:
 * :ABOLISHED_MUNICIPALITIES_FILEPATH: : a dataset of abolished municipalities
 * :MUNICIPALITIES_CATASTALI_FILEPATH: : a list of codici catastali associated to the municipality
 */
export const exportAbolishedMunicipality = async () => {
  // mapping [municipalityName.toLowerCase()] : codiceCatastale
  console.log("[1/2] Start generation for removed municipalities...");
  const municipalityToCatastale = await loadMunicipalityToCatastale();

  const removedMunicipalities = loadAbolishedMunicipalities(
    municipalityToCatastale
  );

  if (removedMunicipalities.isLeft()) {
    console.log(
      chalk.red(
        `Error while loading abolished municipalities [${
          removedMunicipalities.value.name
        }] : ${removedMunicipalities.value.message}`
      )
    );
  } else {
    await Promise.all(
      removedMunicipalities.value.map(x =>
        serializeMunicipalityToJson(<SerializableMunicipality>x)
      )
    );
    console.log("[2/2] Generation completed!");
  }
};

const loadMunicipalityToCatastale = async (): Promise<Map<string, string>> => {
  // read raw data from csv
  const municipalityWithCatastaleRaw = fs
    .readFileSync(MUNICIPALITIES_CATASTALI_FILEPATH)
    .toString("utf8");

  // parse raw data
  const municipalitiesCatastaleRows = await parseCsvPromise(
    municipalityWithCatastaleRaw,
    optionMunicipalitiesWithCatastale
  );

  // transform raw data to: [municipalityName] : codiceCatastale
  return municipalitiesCatastaleRows.reduce(function(
    map: Map<string, string>,
    row
  ) {
    map.set(row[1].toLowerCase(), row[0]);
    return map;
  },
  new Map<string, string>());
};

/**
 * load the abolished municipality and filter the municipality without catastal code
 * @param municipalityToCatastale: used to filter and remove the municipality without catastal code
 */
const loadAbolishedMunicipalities = (
  municipalityToCatastale: Map<string, string>
) => {
  return tryCatch2v(
    () => {
      const removedMunicipalitiesRaw = fs
        .readFileSync(ABOLISHED_MUNICIPALITIES_FILEPATH)
        .toString("utf8");
      return (
        (<any[]>JSON.parse(removedMunicipalitiesRaw))
          //exclude the dirty data and the municipality without codiceCatastale
          .filter(
            removedMunicipality =>
              AbolishedMunicipality.is(removedMunicipality) &&
              municipalityToCatastale.has(
                removedMunicipality.comune.toLowerCase()
              )
          )
          //transform the raw data in SerializableMunicipality
          .map(municipalityRaw => {
            const maybeAbolishedMunicipality = AbolishedMunicipality.decode(
              municipalityRaw
            );
            if (maybeAbolishedMunicipality.isRight()) {
              const abolishedMunicipality = maybeAbolishedMunicipality.value;
              const codiceCatastale = <string>(
                municipalityToCatastale.get(
                  abolishedMunicipality.comune.toLowerCase()
                )
              );
              return fromAbolishedMunicipalityToSerializableMunicipality(
                abolishedMunicipality,
                codiceCatastale
              );
            }
          })
      );
    },
    ex => new Error(String(ex))
  );
};

const fromAbolishedMunicipalityToSerializableMunicipality = (
  abolishedMunicipality: t.TypeOf<typeof AbolishedMunicipality>,
  codiceCatastale: string
) => {
  return <SerializableMunicipality>{
    codiceCatastale: codiceCatastale,
    municipality: {
      codiceProvincia: "",
      codiceRegione: "",
      denominazione: abolishedMunicipality.comune,
      denominazioneInItaliano: abolishedMunicipality.comune,
      denominazioneRegione: "",
      siglaProvincia: abolishedMunicipality.provincia
    }
  };
};
