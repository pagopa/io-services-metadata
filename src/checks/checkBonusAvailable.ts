// a simple check that bonus available json respects type definition
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BonusesAvailable } from "../../generated/definitions/content/BonusesAvailable";
import { basicJsonFileValidator, printDecodeOutcome } from "./validateJson";

const filename = "bonus/bonus_available.json";
const jsonPath = __dirname + `/../../${filename}`;

const returnCode = pipe(
  printDecodeOutcome(
    basicJsonFileValidator(jsonPath, BonusesAvailable),
    filename
  ),
  E.fold(
    _ => 1,
    __ => 0
  )
);

process.exit(returnCode);
