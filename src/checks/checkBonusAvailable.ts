// a simple check that bonus available json respects type definition

import * as fs from "fs";
import { BonusesAvailable } from "../../generated/definitions/content/BonusesAvailable";

const isRight = BonusesAvailable.decode(
  JSON.parse(
    fs.readFileSync(__dirname + "/../../bonus/bonus_available.json").toString()
  )
).isRight();
if (!isRight) {
  console.error(
    "bonus/bonus_available.json is not compatible with BonusesAvailable type"
  );
}
process.exit(isRight ? 0 : 1);
