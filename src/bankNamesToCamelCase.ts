import { debug as cdebug } from "console";
import { readFileSync } from "fs";

const myFile = readFileSync(__dirname + "/../status/abi.json");
cdebug("FILE", myFile);