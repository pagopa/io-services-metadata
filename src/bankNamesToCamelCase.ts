import { capitalCase } from "change-case";
import { debug as cdebug } from "console";
import { readFileSync } from "fs";

interface IBank {
  abi: number;
  name: string;
}

const statusAbi = JSON.parse(
  readFileSync(__dirname + "/../status/abi.json").toString()
);
const banks = statusAbi.data as ReadonlyArray<IBank>;

const bankNameReducer = (
  accumulator: ReadonlyArray<IBank>,
  currentBank: IBank
) =>
  accumulator.concat({
    abi: currentBank.abi,
    name: capitalCase(currentBank.name)
  } as IBank);
const updBanks = banks.reduce(bankNameReducer, []);
const updStatusAbi = { data: updBanks };

cdebug("JSON", JSON.stringify(updStatusAbi));
cdebug("OBJ", updStatusAbi);
