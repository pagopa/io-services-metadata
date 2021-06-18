import { exportAbolishedMunicipality } from "./municipality/abolished_municipality";
import { checkMunicipalityOutput } from "./municipality/checkMuniticipalityOutput";
import { exportCurrentMunicipalities } from "./municipality/current_municipality";
import { exportForeignMunicipalities } from "./municipality/foreign_countries";

const run = async () => {
  // first correlate the abolished municipalities with the codice catastale and serialize the json
  await exportAbolishedMunicipality();
  // export the current updated municipalities and override the previous data if more updated data is available
  await exportCurrentMunicipalities();
  // export the foreign municipalities
  await exportForeignMunicipalities();
  // check if all json produces are valid. If not, an error message will be prompt
  checkMunicipalityOutput();
};
run()
  .then(() => console.log("done"))
  .catch(ex => console.log(ex));
