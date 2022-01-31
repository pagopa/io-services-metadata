// a simple check that bonus available json respects type definition

import * as fs from "fs";
import * as jsonValidator from "json-dup-key-validator";
import { BonusesAvailable } from "../../generated/definitions/content/BonusesAvailable";

const isRight = BonusesAvailable.decode(
  jsonValidator.parse(
    fs.readFileSync(__dirname + "/../../bonus/bonus_available.json").toString(),
    false
  )
).isRight();
if (!isRight) {
  console.error(
    "bonus/bonus_available.json is not compatible with BonusesAvailable type"
  );
}
process.exit(isRight ? 0 : 1);
