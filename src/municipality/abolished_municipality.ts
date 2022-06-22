import chalk from "chalk";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as fs from "fs-extra";
import * as t from "io-ts";
import {
  ABOLISHED_MUNICIPALITIES_FILEPATH,
  MUNICIPALITIES_CATASTALI_FILEPATH
} from "../config";
import {
  AbolishedMunicipality,
  AbolishedMunicipalityArray
} from "../types/AbolishedMunicipality";
import { ISerializableMunicipality } from "../types/ISerializableMunicipality";
import { logError } from "../utils/log_left_error";
import { parseCsvPromise } from "../utils/parse_csv_promise";
import { readFileToString } from "../utils/read_file_to_string";
import { serializeMunicipalityToJson } from "./serialize_municipality";

const optionMunicipalitiesWithCatastale = {
  delimiter: ",",
  from_line: 1,
  skip_empty_lines: true,
  skip_lines_with_error: true,
  trim: true
};

/**
 * load all the codici catastali and create a mapping between the name of the municipality and the codice catastale
 */
const loadMunicipalityToCatastale = async (): Promise<
  E.Either<Error, Map<string, string>>
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
    return E.right(
      municipalitiesCatastaleRows.reduce((map: Map<string, string>, row) => {
        map.set(row[1].toLowerCase(), row[0]);
        return map;
      }, new Map<string, string>())
    );
  } catch (e) {
    return E.left(new Error(String(e)));
  }
};

const fromAbolishedMunicipalityToSerializableMunicipality = (
  abolishedMunicipality: t.TypeOf<typeof AbolishedMunicipality>,
  codiceCatastale: string
) =>
  ({
    codiceCatastale,
    municipality: {
      codiceProvincia: "",
      codiceRegione: "",
      denominazione: abolishedMunicipality.comune,
      denominazioneInItaliano: abolishedMunicipality.comune,
      denominazioneRegione: "",
      siglaProvincia: abolishedMunicipality.provincia
    }
  } as ISerializableMunicipality);

/**
 * load the abolished municipality and filter the municipality without catastal code
 * @param municipalityToCatastale: used to filter and remove the municipality without catastal code
 */
const loadAbolishedMunicipalities = (
  municipalityToCatastale: Map<string, string>
): E.Either<Error, ReadonlyArray<ISerializableMunicipality>> =>
  pipe(
    readFileToString(ABOLISHED_MUNICIPALITIES_FILEPATH),
    E.chain(rawFile => pipe(
      AbolishedMunicipalityArray.decode(JSON.parse(rawFile)),
      E.mapLeft(
        _ =>
          new Error(
            "Fail to parse the json file: " + ABOLISHED_MUNICIPALITIES_FILEPATH
          )
      )
    )),
    E.map(abolishedMunArray =>
      abolishedMunArray
        .filter(am => municipalityToCatastale.has(am.comune.toLowerCase()))
        .map(am =>
          fromAbolishedMunicipalityToSerializableMunicipality(
            am,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            municipalityToCatastale.get(am.comune.toLowerCase())!
          ))
    )
  );

/**
 * This function export the data of the abolished municipalities, creating the data starting from two dataset:
 * :ABOLISHED_MUNICIPALITIES_FILEPATH: : a dataset of abolished municipalities
 * :MUNICIPALITIES_CATASTALI_FILEPATH: : a list of codici catastali associated to the municipality
 */
export const exportAbolishedMunicipality = async () => {
  console.log(
    chalk.gray("[1/2]"),
    "Start generation of abolished municipalites from local dataset"
  );
  const serializeMunicipalityPromise = pipe((await loadMunicipalityToCatastale()),
    E.chain(municipalityToCatastale =>
      loadAbolishedMunicipalities(municipalityToCatastale)
    ),
    E.map(abolishedMunicipalities =>
      abolishedMunicipalities.map(municipality =>
        serializeMunicipalityToJson(municipality)
      )
    ));

  if (E.isLeft(serializeMunicipalityPromise)) {
    logError(serializeMunicipalityPromise.left, "Error while exporting abolished municipalities");
    return;
  }
  await Promise.all(serializeMunicipalityPromise.right);
  console.log(
    chalk.gray("[2/2]"),
    "Generation of abolished municipalites completed"
  );
};
