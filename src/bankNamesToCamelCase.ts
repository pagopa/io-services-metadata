import { capitalCase } from "change-case";
import { debug as cdebug } from "console";
import { readFileSync } from "fs";

interface IBank {
  abi: number;
  name: string;
}

const bccR = /(B C C)|(Bcc)/;
const spaR = /(S P A)|(Spa)/;

const statusAbi = JSON.parse(
  readFileSync(__dirname + "/../status/abi.json").toString()
);
const banks = statusAbi.data as ReadonlyArray<IBank>;

const bankNameReducer = (
  accumulator: ReadonlyArray<IBank>,
  currentBank: IBank
) => {
  const ccBankname = capitalCase(currentBank.name)
    .replace(bccR, "BCC")
    .replace(spaR, "SPA");
  return accumulator.concat({
    abi: currentBank.abi,
    name: ccBankname
  } as IBank);
};
const updBanks = banks.reduce(bankNameReducer, []);
const updStatusAbi = { data: updBanks };

cdebug("JSON", JSON.stringify(updStatusAbi));
cdebug("OBJ", updStatusAbi);
