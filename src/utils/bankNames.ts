import { capitalCase } from "change-case";

interface IBank {
  abi: string;
  name: string;
}

export interface IAbi {
  data: ReadonlyArray<IBank>;
}

const bccR = /(B\s*C\s+C)|(Bcc)/i;
const spaR = /(S\s+P\s+A)|(Spa)/;
const scR = /(S\s+C)|(Sc)/;
const multiSpaceR = /\s+/g;
const quoteR = /(['"’])\s+/;
const delR = /\s+(d(el|ell|ello|ella|elle|ei|egli|i))(\s+|'|’)/gi;
const eR = /\s+E(d)?\s+/g;
const unicreditR = /Unicredit/g;

const options = {
  splitRegexp: /([a-z"'’])([A-Z0-9])/g,
  stripRegexp: /[^A-Z0-9àèéòùì'’"&\\-]/gi
};

const bankNameReducer = (
  accumulator: ReadonlyArray<IBank>,
  currentBank: IBank
) =>
  accumulator.concat({
    abi: currentBank.abi,
    name: capitalCase(currentBank.name, options)
      .replace(bccR, "BCC")
      .replace(spaR, "SPA")
      .replace(scR, "SC")
      .replace(multiSpaceR, " ")
      .replace(quoteR, "$1")
      .replace(delR, " d$2$3")
      .replace(eR, " e$1 ")
      .replace(unicreditR, "UniCredit")
  } as IBank);

export function toCamelCase(sourceAbi: IAbi): IAbi {
  const updBanks = sourceAbi.data.reduce(bankNameReducer, []);
  return { data: updBanks };
}
