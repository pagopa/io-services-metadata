import * as fs from "fs-extra";
import {
  ABOLISHED_MUNICIPALITIES_FILEPATH,
  MUNICIPALITIES_CATASTALI_FILEPATH
} from "../config";
import { parseCsvPromise } from "../utils/parse_csv_promise";
import { AbolishedMunicipality } from "../types/AbolishedMunicipality";
import { SerializableMunicipality } from "../types/SerializableMunicipality";
import {
  tryCatch2v,
  right,
  left,
  Either
} from "../../node_modules/fp-ts/lib/Either";
import * as t from "io-ts";
import { serializeMunicipalityToJson } from "./serialize_municipality";
import chalk from "chalk";
import { logError } from "../utils/log_left_error";

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
  const serializeMunicipalityPromise = (await loadMunicipalityToCatastale())
    .chain(municipalityToCatastale =>
      loadAbolishedMunicipalities(municipalityToCatastale)
    )
    .map(abolishedMunicipalities =>
      abolishedMunicipalities.map(municipality =>
        serializeMunicipalityToJson(<SerializableMunicipality>municipality)
      )
    );

  if (serializeMunicipalityPromise.isLeft()) {
    logError(
      <Error>serializeMunicipalityPromise.value,
      "Error while exporting abolished municipalities"
    );
    return;
  }
  await Promise.all(serializeMunicipalityPromise.value);
};

/**
 * load all the codici catastali and create a mapping between the name of the municipality and the codice catastale
 */
const loadMunicipalityToCatastale = async (): Promise<
  Either<Error, Map<string, string>>
> => {
  // read raw data from csv
  try {
    const municipalityWithCatastaleRaw = fs
      .readFileSync(MUNICIPALITIES_CATASTALI_FILEPATH)
      .toString("utf8");

    // parse raw data
    const municipalitiesCatastaleRows = await parseCsvPromise(
      municipalityWithCatastaleRaw,
      optionMunicipalitiesWithCatastale
    );

    // transform raw data to: [municipalityName] : codiceCatastale
    return right(
      municipalitiesCatastaleRows.reduce(function(
        map: Map<string, string>,
        row
      ) {
        map.set(row[1].toLowerCase(), row[0]);
        return map;
      },
      new Map<string, string>())
    );
  } catch (e) {
    return left(new Error(String(e)));
  }
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
