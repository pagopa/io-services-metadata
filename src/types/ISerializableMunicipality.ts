import { Municipality } from "../../generated/definitions/content/Municipality";

export interface ISerializableMunicipality {
  codiceCatastale: string;
  municipality: Municipality;
}
