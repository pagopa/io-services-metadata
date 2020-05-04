import * as path from "path";

export const ROOT = path.join(__dirname, "../");

export const ITALIAN_MUNICIPALITIES_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

export const MUNICIPALITIES_OUTPUT_FOLDER_NAME = "municipalities";

export const DATA_PATH = "data";

export const MUNICIPALITIES_INPUT_FOLDER_PATH = path.join(
  DATA_PATH,
  "municipalities"
);

export const ABOLISHED_MUNICIPALITIES_FILEPATH = path.join(
  MUNICIPALITIES_INPUT_FOLDER_PATH,
  "abolished.json"
);

export const MUNICIPALITIES_CATASTALI_FILEPATH = path.join(
  MUNICIPALITIES_INPUT_FOLDER_PATH,
  "municipalities_with_catastale.csv"
);

export const FOREIGN_COUNTRIES_FILEPATH = path.join(
  DATA_PATH,
  "Elenco-codici-e-denominazioni-al-31_12_2018.csv"
);
