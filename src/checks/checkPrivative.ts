import { PrivativeServices } from "../../generated/definitions/pagopa/privative/PrivativeServices";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "status/privativeServices.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, PrivativeServices),
  filename
).fold(
  _ => 1,
  __ => 0
);

process.exit(returnCode);
