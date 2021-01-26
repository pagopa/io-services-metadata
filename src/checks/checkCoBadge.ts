import fs from "fs";
import { CoBadgeServices } from "../../generated/definitions/pagopa/cobadge/CoBadgeServices";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";
import { CoBadgeService } from "../../generated/definitions/pagopa/cobadge/CoBadgeService";
import { CoBadgeAbi } from "../../generated/definitions/pagopa/cobadge/CoBadgeAbi";

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

const fileContent = fs
  .readFileSync(__dirname + "/../../status/cobadgeServices.json")
  .toString();
const maybeCobadgeServices = CoBadgeServices.decode(JSON.parse(fileContent));
if (!maybeCobadgeServices.isRight()) {
  error(
    "status/cobadgeServices.json is not compatible with CoBadgeServices type"
  );
} else {
  const cobadgeServices = maybeCobadgeServices.value;
  // check for duplicated keys
  Object.keys(cobadgeServices).forEach(k => {
    const count = (fileContent.match(new RegExp(`"${k}"`, "gm")) || []).length;
    if (count > 1) {
      error(`key '${k}' is duplicated!`);
    }
  });
  const abiRegistryFileContent = fs
    .readFileSync(__dirname + "/../../status/abi.json")
    .toString();
  const maybeAbiRegistry = AbiListResponse.decode(
    JSON.parse(abiRegistryFileContent)
  );
  if (maybeAbiRegistry.isLeft()) {
    error(`can't decode abi registry status/abi.json`);
  } else {
    const services = Object.keys(cobadgeServices).map<CoBadgeService>(
      serviceName => cobadgeServices[serviceName]
    );
    const servicesBanks = services.reduce<ReadonlyArray<CoBadgeAbi>>((acc,curr) => [...acc,...(curr.abi)],[]);

    const registry: ReadonlyArray<Abi> = maybeAbiRegistry.value.data || [];
    services.forEach((service: CoBadgeService) => {
      if(!registry.some(a => a.name === service.name))
    });
  }

  process.exit(0);
}
