import fs from "fs";
import { CoBadgeServices } from "../../generated/definitions/pagopa/cobadge/CoBadgeServices";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";
import { CoBadgeService } from "../../generated/definitions/pagopa/cobadge/CoBadgeService";
import { CoBadgeIssuer } from "../../generated/definitions/pagopa/cobadge/CoBadgeIssuer";

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
    .readFileSync(__dirname + "/../../bonus/bpd/abi/pm_abi.json")
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
    const cobadgeIssuers = services.reduce<ReadonlyArray<CoBadgeIssuer>>(
      (acc, curr) => [...acc, ...curr.issuers],
      []
    );

    const registry: ReadonlyArray<Abi> = maybeAbiRegistry.value.data || [];
    // tslint:disable-next-line: no-let
    let hasErrors = false;
    // tslint:disable-next-line: readonly-array
    const missingIssuers: Abi[] = [];
    cobadgeIssuers.forEach((service: CoBadgeIssuer) => {
      const registryIssuer = registry.find(a => a.abi === service.abi);
      if (registryIssuer === undefined) {
        if(service.name.trim().length ==)
        missingIssuers.push({ ...service });
        return;
      }
      if (registryIssuer.name !== service.name) {
        console.log(
          `abi ${service.abi} with name "${
            service.name
          }" has a different name from the one in /bonus/bpd/abi/pm_abi.json "${
            registryIssuer.name
          }"`
        );
        hasErrors = true;
      }
    });
    console.log(missingIssuers);
    if (hasErrors) {
      process.exit(1);
    }
  }

  process.exit(0);
}
