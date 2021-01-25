// a simple check that bonus available json respects type definition

import * as fs from "fs";
import { ContextualHelp } from "../../generated/definitions/content/ContextualHelp";

const isRight = ContextualHelp.decode(
  JSON.parse(
    fs.readFileSync(__dirname + "/../contextualhelp/data.json").toString()
  )
).isRight();
if (!isRight) {
  console.error(
    "contextualhelp/data.json is not compatible with ContextualHelp type"
  );
}
process.exit(isRight ? 0 : 1);
