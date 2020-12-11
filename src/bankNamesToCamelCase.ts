import { debug as cdebug } from "console";
import { readFileSync, writeFileSync } from "fs";
import { toCamelCase, IAbi } from "./utils/bankNames";

const updStatusAbi = toCamelCase(JSON.parse(
  readFileSync(__dirname + "/../status/abi.json").toString()
) as IAbi);

writeFileSync(
  __dirname + "/../status/abiCapitalCase.json",
  JSON.stringify(updStatusAbi)
);