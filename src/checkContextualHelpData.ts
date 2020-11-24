// a simple check that bonus available json respects type definition

import * as fs from "fs";
import { ContextualHelp } from "../definitions/ContextualHelp";

const isRight = ContextualHelp.decode(
  JSON.parse(
    fs.readFileSync(__dirname + "/../contextualhelp/data.json").toString()
  )
).isRight();

process.exit(isRight ? 0 : 1);
