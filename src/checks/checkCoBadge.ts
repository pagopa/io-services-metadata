/* eslint-disable import/order */
/**
 * this script checks about the cobadgeServices.json integrity and updates abi.json if necessary
 * - cobadgeServices.json: this file is requested by the app
 * - abi.json: this file is requested by the app
 * - pm_abi.json: this file is NOT requested by the app is the data coming from PM as it is
 * - abi.json is a file built merging the information coming from /bonus/bpd/abi/pm_abi.json and cobadgeServices.json
 * - if an abi is present in cobadgeServices.json but not in abi.json it will be automatically added by this script
 */
import * as E from "fp-ts/lib/Either";
import fs from "fs";
import * as jsonValidator from "json-dup-key-validator";
import { CoBadgeIssuer } from "../../generated/definitions/pagopa/cobadge/CoBadgeIssuer";
import { CoBadgeService } from "../../generated/definitions/pagopa/cobadge/CoBadgeService";
import { CoBadgeServices } from "../../generated/definitions/pagopa/cobadge/CoBadgeServices";
import { Abi } from "../../generated/definitions/pagopa/walletv2/Abi";
import { AbiListResponse } from "../../generated/definitions/pagopa/walletv2/AbiListResponse";
import { getDuplicates } from "../utils/collections";

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

const fileContent = fs
  .readFileSync(__dirname + "/../../status/cobadgeServices.json")
  .toString();
const maybeCobadgeServices = CoBadgeServices.decode(
  jsonValidator.parse(fileContent, false)
);
if (E.isLeft(maybeCobadgeServices)) {
  error(
    "status/cobadgeServices.json is not compatible with CoBadgeServices type"
  );
} else {
  const cobadgeServices = maybeCobadgeServices.right;
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
  if (E.isLeft(maybeAbiRegistry)) {
    error(`can't decode abi registry status/abi.json`);
  } else {
    const services = Object.keys(cobadgeServices).map<CoBadgeService>(
      serviceName => cobadgeServices[serviceName]
    );
    const cobadgeIssuers = services.reduce<ReadonlyArray<CoBadgeIssuer>>(
      (acc, curr) => [...acc, ...curr.issuers],
      []
    );

    const registry: ReadonlyArray<Abi> = maybeAbiRegistry.right.data || [];

    // eslint-disable-next-line functional/no-let
    let hasErrors = false;

    const missingAbis: Array<Abi> = [];
    /**
     * for each issuer
     * - check if some of them has empty name
     * - check if some of them is not present in the abi registry (/bonus/bpd/abi/pm_abi.json). if yes, add it
     * - check if some of them has a name different from the one present in the abi registry
     */
    cobadgeIssuers.forEach((service: CoBadgeIssuer) => {
      const registryIssuer = registry.find(a => a.abi === service.abi);
      if (registryIssuer === undefined) {
        if (service.name.trim().length === 0) {
          console.log(`abi ${service.abi} cannot have an empty name`);
          hasErrors = true;
          return;
        }
        // eslint-disable-next-line functional/immutable-data
        missingAbis.push({ ...service });
        return;
      }
      if (registryIssuer.name !== service.name) {
        console.log(
          `[${service.abi}] with name "${service.name}" should be "${registryIssuer.name}"`
        );
        hasErrors = true;
      }
    });
    // check for repeated abi
    const duplicated = getDuplicates(
      cobadgeIssuers,
      (a: Abi, b: Abi) => a.abi === b.abi
    );
    if (duplicated.length > 0) {
      console.log(
        `these abi are repeated more than one time:\n${duplicated
          .map(d => d.abi)
          .join("\n")}`
      );
      hasErrors = true;
    }

    if (hasErrors) {
      process.exit(1);
    }
    if (missingAbis.length > 0) {
      const updatedRegistry = {
        ...maybeAbiRegistry.right,
        data: [...registry, ...missingAbis]
      };
      console.log(
        `${missingAbis.length} abi in cobadgeServices.json are not present into abi.json, they will be added`
      );
      missingAbis.forEach(console.log);
      fs.writeFileSync(
        __dirname + "/../../status/abi.json",
        JSON.stringify(AbiListResponse.encode(updatedRegistry), null, 2)
      );
      process.exit(1);
    }
  }

  process.exit(0);
}
