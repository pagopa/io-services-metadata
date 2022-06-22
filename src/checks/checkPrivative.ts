import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { PrivativeServices } from "../../generated/definitions/pagopa/privative/PrivativeServices";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "status/privativeServices.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(
    basicJsonFileValidator(jsonPath, PrivativeServices),
    filename
  ),
  E.fold(_ => 1, __ => 0)
);

process.exit(returnCode);
