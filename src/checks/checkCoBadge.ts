import fs from "fs";
import { CoBadgeServices } from "../../generated/definitions/pagopa/cobadge/CoBadgeServices";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";

const fileContent = fs
  .readFileSync(__dirname + "/../../status/cobadgeServices.json")
  .toString();
const maybeCobadgeServices = CoBadgeServices.decode(JSON.parse(fileContent));
if (!maybeCobadgeServices.isRight()) {
  console.error(
    "status/cobadgeServices.json is not compatible with CoBadgeServices type"
  );
  process.exit(1);
} else {
  const cobadgeServices = maybeCobadgeServices.value;
  // check for duplicated keys
  Object.keys(cobadgeServices).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      console.error(`key '${k}' is duplicated!`);
      process.exit(1);
    }
  });
  const abiRegistryFileContent = fs
    .readFileSync(__dirname + "/../../status/abi.json")
    .toString();
  const maybeAbiRegistry = AbiListResponse.decode(
    JSON.parse(abiRegistryFileContent)
  );
  if (maybeAbiRegistry.isLeft()) {
    console.error(`can't decode abi registry status/abi.json`);
    process.exit(1);
  } else {
    const abi = Object.keys(cobadgeServices)
      .map(serviceName => cobadgeServices[serviceName].abi)
      .reduce((acc, curr) => [...acc, ...curr], []);
    const data: ReadonlyArray<Abi> = maybeAbiRegistry.value.data || [];
    const abiRegistry = new Set<string>(data.map(a => a.abi || ""));
    const missingAbi = abi.filter(a => !abiRegistry.has(a));
    if (missingAbi.length > 0) {
      console.error(`can't find some abi in status/abi.json registry`);
      console.error(missingAbi);
      process.exit(1);
    }
  }

  process.exit(0);
}
