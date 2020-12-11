import { capitalCase } from "change-case";
import { debug as cdebug } from "console";
import { readFileSync } from "fs";

type Bank = { abi: number; name: string };
// const bcc = /(B C C) | (Banca Di Credito Cooperativo)/;

const statusAbi = JSON.parse(readFileSync(__dirname + "/../status/abi.json").toString());
const banks : Array<Bank> = statusAbi.data;
const bankNameReducer = (accumulator: Array<Bank>, currentBank: Bank) => (
  accumulator.concat({ abi: currentBank.abi, name: capitalCase(currentBank.name) } as Bank));
const updBanks = banks.reduce(bankNameReducer, []);
const updStatusAbi = {data: updBanks};

cdebug("JSON", JSON.stringify(updStatusAbi));
cdebug("OBJ", updStatusAbi);