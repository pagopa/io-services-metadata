// a simple check that bonus available json respects type definition

import { BonusesAvailable } from "../../generated/definitions/content/BonusesAvailable";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "bonus/bonus_available.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = printDecodeOutcome(
  basicJsonFileValidator(jsonPath, BonusesAvailable),
  filename
).fold(
  _ => 1,
  __ => 0
);

process.exit(returnCode);
