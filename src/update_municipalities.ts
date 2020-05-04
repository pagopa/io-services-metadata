import { exportAbolishedMunicipality } from "./municipality/abolished_municipality";
import { exportCurrentMunicipalities } from "./municipality/current_municipality";
import { exportForeignMunicipalities } from "./municipality/foreign_countries";
import * as fs from "fs-extra";
import { MUNICIPALITIES_CATASTALI_FILEPATH } from "./config";

async function run() {
  // first correlate the abolished municipalities with the codice catastale and serialize the json
  await exportAbolishedMunicipality();
  // export the current updated municipalities and override the previous data if more updated data is available
  await exportCurrentMunicipalities();
  // export the foreign municipalities
  await exportForeignMunicipalities();
}
run().then(() => console.log("done"));
