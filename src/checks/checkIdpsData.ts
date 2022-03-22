// a simple check that idps list json respects type definition

import { SpidIdps } from "../../generated/definitions/content/SpidIdps";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "spid/idps/list.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, SpidIdps),
  filename
).fold(
  _ => 1,
  __ => 0
);

process.exit(returnCode);
