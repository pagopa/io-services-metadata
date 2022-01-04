import fs from "fs";
import { PrivativeServices } from "../../generated/definitions/pagopa/privative/PrivativeServices";
import * as jsonValidator from "json-dup-key-validator";

const fileContent = fs
  .readFileSync(__dirname + "/../../status/privativeServices.json")
  .toString();
const privativeServices = PrivativeServices.decode(
  jsonValidator.parse(fileContent, false)
);
if (!privativeServices.isRight()) {
  console.error(
    "status/privativeServices.json is not compatible with PrivativeServices type"
  );
  process.exit(1);
}
process.exit(0);
