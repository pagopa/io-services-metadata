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
const multiSpaceR = /\s+/g;
const quoteR = /"\s+/;

const options = {
  splitRegexp: /([a-z"])([A-Z0-9])/g,
  stripRegexp: /[^A-Z0-9àèéòùì'"&\-]/gi
};

const bankNameReducer = (
  accumulator: ReadonlyArray<IBank>,
  currentBank: IBank
) => {
  return accumulator.concat({
    abi: currentBank.abi,
    name: capitalCase(currentBank.name, options)
      .replace(bccR, "BCC")
      .replace(spaR, "SPA")
      .replace(multiSpaceR, " ")
      .replace(quoteR, '"')
  } as IBank);
};

export function toCamelCase(sourceAbi: IAbi): IAbi {
  const updBanks = sourceAbi.data.reduce(bankNameReducer, []);
  return { data: updBanks };
}
