// a simple check that idps list json respects type definition

import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { SpidIdps } from "../../generated/definitions/content/SpidIdps";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "spid/idps/list.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(
  basicJsonFileValidator(jsonPath, SpidIdps),
  filename
),
E.foldW(
  _ => 1,
  __ => 0
));

process.exit(returnCode);
