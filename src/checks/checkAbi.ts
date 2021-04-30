import fs from "fs";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";

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
const maybeAbiRegistry = AbiListResponse.decode(JSON.parse(fileContent));

if (maybeAbiRegistry.isLeft()) {
  error(`can't decode abi registry status/abi.json`);
} else {
  // tslint:disable-next-line
  let allLogoExists = true;
  (maybeAbiRegistry.value.data || []).forEach(issuer => {
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
  process.exit(0);
}
