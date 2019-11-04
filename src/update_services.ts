// tslint:disable:no-console

import chalk from "chalk";
import * as fs from "fs-extra";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as yaml from "js-yaml";
import * as path from "path";

import { scopeEnum, Service } from "../definitions/Service";

const Services = t.dictionary(t.string, Service);
type ScopeServices = { [key in keyof typeof scopeEnum]: ReadonlyArray<string> };
const root = path.join(__dirname, "../");

async function run(rootPath: string): Promise<void> {
  console.log(chalk.whiteBright("Services builder"));

  const servicesYamlPath = path.join(rootPath, "services.yml");
  console.log("Services YAML:", chalk.blueBright(servicesYamlPath));

  console.log(chalk.gray("[1/3]"), "Reading services data...");
  const servicesYamlContent = await fs.readFile(servicesYamlPath);
  try {
    const servicesYamlData = yaml.safeLoad(servicesYamlContent.toString(), {
      filename: servicesYamlPath,
      json: false,
      strict: true
    });
    const maybeServices = Services.decode(servicesYamlData);
    if (maybeServices.isLeft()) {
      console.log(chalk.red(PathReporter.report(maybeServices).join("\n")));
      throw Error("Invalid services YAML");
    }
    const services = maybeServices.value;
    const serviceIds = Object.keys(services);
    console.log(chalk.greenBright(`Found ${serviceIds.length} service(s).`));

    console.log(chalk.gray("[2/3]"), "Generating services JSON...");
    await Promise.all(
      serviceIds.map(async serviceId => {
        const servicePath = path.join(
          "services",
          `${serviceId.toLowerCase()}.json`
        );
        console.log(chalk.greenBright(servicePath));
        await fs.writeFile(
          path.join(root, servicePath),
          JSON.stringify(services[serviceId])
        );
      })
    );

    const locals = serviceIds.filter(sId => {
      const service = services[sId];
      return service.scope === scopeEnum.LOCAL;
    });
    const nationals = serviceIds.filter(sId => {
      const service = services[sId];
      return service.scope === scopeEnum.NATIONAL;
    });
    const scopeService: ScopeServices = { NATIONAL: nationals, LOCAL: locals };
    await fs.writeFile(
      path.join(root, path.join("services", "scopeServices.json")),
      JSON.stringify(scopeService)
    );

    console.log(chalk.gray("[2/3]"), "Generating services JSON...");
  } catch (e) {
    console.log(chalk.red(e.message));
    throw e;
  }
}

run(root).then(() => console.log("done"), () => process.exit(1));
