/**
 * this script defines the types representing the json data contained in "/services-webview" folder
 * to ensure they are in the expected and don't have semantic errors
 */

import * as t from "io-ts";
import { OrganizationFiscalCode } from "italia-ts-commons/lib/strings";
import { ScopeEnum } from "../../generated/definitions/content/Service";
import { enumType } from "italia-ts-commons/lib/types";
import fs from "fs";
import { readableReport } from "italia-ts-commons/lib/reporters";

const ServiceO = t.partial({
  d: t.string,
  sc: enumType<ScopeEnum>(ScopeEnum, "scope")
});

const ServiceR = t.interface({
  i: t.string,
  n: t.string,
  q: t.number
});

const Organization = t.interface({
  fc: OrganizationFiscalCode,
  o: t.string,
  s: t.readonlyArray(t.intersection([ServiceR, ServiceO]))
});
const Organizations = t.readonlyArray(Organization);
const files: ReadonlyArray<string> = [
  "/../../services-webview/visible-services-compact.json",
  "/../../services-webview/visible-services-extended.json"
];

const error = (message: string) => {
  console.error(message);
  process.exit(1);
};

files.forEach(file => {
  const fileName = file.split("/").reverse()[0];
  const fileContent = fs.readFileSync(__dirname + file).toString();
  const organizations = Organizations.decode(JSON.parse(fileContent));
  // check if data represents valid Organizations
  if (organizations.isLeft()) {
    error(
      `${fileName} is not compatible with Organizations type: ${readableReport(
        organizations.value
      )}`
    );
    return;
  }

  // check if there are organization/services ID repetitions
  const orgsCf = new Set<string>();
  const servicesId = new Set<string>();
  organizations.value.forEach(org => {
    // organizations
    const prevSize = orgsCf.size;
    if (orgsCf.add(org.fc).size === prevSize) {
      error(
        `"${fileName}" - organization fiscal code ${
          org.fc
        } is present multiple times`
      );
    }
    // inner services
    org.s.forEach(serv => {
      const prevServiceIdSize = servicesId.size;
      if (servicesId.add(serv.i).size === prevServiceIdSize) {
        error(`"${fileName}" - service ID ${org.fc} is present multiple times`);
      }
    });
  });
});

process.exit(0);
