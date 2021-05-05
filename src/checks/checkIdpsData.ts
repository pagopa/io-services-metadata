// a simple check that idps list json respects type definition

import * as fs from "fs";
import { SpidIdps } from "../../generated/definitions/content/SpidIdps";

const isRight = SpidIdps.decode(
  JSON.parse(
    fs.readFileSync(__dirname + "/../../spid/idps/list.json").toString()
  )
).isRight();
if (!isRight) {
  console.error("spid/idps/list.json is not compatible with SpidIdps type");
}
process.exit(isRight ? 0 : 1);
