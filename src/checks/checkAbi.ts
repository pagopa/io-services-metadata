import fs from "fs";
import * as jsonValidator from "json-dup-key-validator";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { getDuplicates } from "../utils/collections";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";

/**
 * this script checks abi.json file
 * - check the data has the expected shape
 * - check each issuer has its own logo
 */

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

const fileContent = fs
  .readFileSync(__dirname + "/../../status/abi.json")
  .toString();
const abiLogoPath = __dirname + "/../../logos/abi/";
const maybeAbiRegistry = AbiListResponse.decode(
  jsonValidator.parse(fileContent, false)
);

if (maybeAbiRegistry.isLeft()) {
  error(`can't decode abi registry status/abi.json`);
} else {
  // tslint:disable-next-line: no-let
  let allLogoExists = true;
  const data = maybeAbiRegistry.value.data || [];
  data.forEach(issuer => {
    if (!fs.existsSync(abiLogoPath + `${issuer.abi}.png`)) {
      console.error(
        `cannot find logo for abi ${issuer.abi} - "${issuer.name}"`
      );
      allLogoExists = false;
    }
  });
  if (!allLogoExists) {
    error(`Please add the missing logo`);
  }
  // check if the total and size match the array length
  if (
    data.length !== maybeAbiRegistry.value.total ||
    data.length !== maybeAbiRegistry.value.size
  ) {
    error(`total & size should be: ${data.length}`);
  }
  // check for duplicates
  const duplicated = getDuplicates(data, (a: Abi, b: Abi) => a.abi === b.abi);
  if (duplicated.length > 0) {
    error(
      `these abi are repeated more than one time:\n${duplicated
        .map(d => d.abi)
        .join("\n")}`
    );
  }
  process.exit(0);
}
