import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BackendStatus } from "../../generated/definitions/content/BackendStatus";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "status/backend.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(basicJsonFileValidator(jsonPath, BackendStatus), filename),
  E.fold(
    _ => 1,
    __ => 0
  )
);

process.exit(returnCode);
