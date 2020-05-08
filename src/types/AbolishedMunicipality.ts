import * as t from "io-ts";

/**
 * This type represent the data of :ABOLISHED_MUNICIPALITIES_FILEPATH:
 */
export const AbolishedMunicipality = t.type({
  comune: t.string,
  istat: t.string,
  provincia: t.string
});

export const AbolishedMunicipalityArray = t.readonlyArray(
  AbolishedMunicipality
);

export type AbolishedMunicipality = t.TypeOf<typeof AbolishedMunicipality>;
