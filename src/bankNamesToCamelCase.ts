import { capitalCase } from "change-case";
import { debug as cdebug } from "console";
import { readFileSync } from "fs";

const statusAbi = JSON.parse(readFileSync(__dirname + "/../status/abi.json").toString());

statusAbi.data.map((bank: { abi: number; name: string}) => { 
  bank.name = capitalCase(bank.name);
});

cdebug("JSON", statusAbi);