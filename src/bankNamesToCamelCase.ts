import { readFileSync, writeFileSync } from "fs";
import { toCamelCase, IAbi } from "./utils/bankNames";

const updStatusAbi = toCamelCase(JSON.parse(
  readFileSync(__dirname + "/../../bonus/bpd/abi/pm_abi.json").toString()
) as IAbi);

writeFileSync(__dirname + "/../status/abi.json", JSON.stringify(updStatusAbi));
