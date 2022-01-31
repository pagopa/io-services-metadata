import fs from "fs";
import * as jsonValidator from "json-dup-key-validator";
import { BackendStatus } from "../../generated/definitions/content/BackendStatus";
const fileContent = fs
  .readFileSync(__dirname + "/../../status/backend.json")
  .toString();
const backendStatus = BackendStatus.decode(
  jsonValidator.parse(fileContent, false)
);
if (!backendStatus.isRight()) {
  console.error(
    "status/backend.json is not compatible with BackendStatus type"
  );
  process.exit(1);
}
process.exit(0);
