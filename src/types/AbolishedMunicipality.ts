import * as t from "io-ts";

/**
 * This type represent the data of :ABOLISHED_MUNICIPALITIES_FILEPATH:
 */
export const AbolishedMunicipality = t.type({
  istat: t.string,
  comune: t.string,
  provincia: t.string
});
