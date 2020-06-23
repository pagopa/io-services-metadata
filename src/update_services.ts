// tslint:disable:no-console

import chalk from "chalk";
import * as fs from "fs-extra";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as yaml from "js-yaml";
import * as path from "path";

import { scopeEnum, Service } from "../definitions/Service";

const Services = t.dictionary(t.string, Service);
// the keys are the scopeEnum (NATIONAL,LOCAL) and the value is the relative services id
type ScopeServices = { [key in keyof typeof scopeEnum]: ReadonlyArray<string> };
const root = path.join(__dirname, "../");

async function run(rootPath: string): Promise<void> {
  console.log(chalk.whiteBright("Services builder"));

  const servicesYamlPath = path.join(rootPath, "services.yml");
  console.log("Services YAML:", chalk.blueBright(servicesYamlPath));

  console.log(chalk.gray("[1/4]"), "Reading services data...");
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

    console.log(chalk.gray("[2/4]"), "Generating services JSON...");
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

    console.log(chalk.gray("[3/4]"), "Generating scope services JSON...");
    // filter the services id which have scope LOCAL
    const locals = serviceIds.filter(sId => {
      const service = services[sId];
      return service.scope === scopeEnum.LOCAL;
    });
    // filter the services id which have scope NATIONAL
    const nationals = serviceIds.filter(sId => {
      const service = services[sId];
      return service.scope === scopeEnum.NATIONAL;
    });

    const scopeService: ScopeServices = { NATIONAL: nationals, LOCAL: locals };
    // dump scopeService as a json
    await fs.writeFile(
      path.join(root, path.join("services", "servicesByScope.json")),
      JSON.stringify(scopeService)
    );

    console.log(chalk.gray("[4/4]"), "Checking data..");
    // print a warning if some services have no email and phone
    const noEmailAndPhoneServices = Object.keys(services).filter(sId => {
      const service = services[sId];
      return service.email === undefined && service.phone === undefined;
    });
    if (noEmailAndPhoneServices.length > 0) {
      console.log(chalk.yellow("⚠️ these services have no email and phone:"));
    }
    noEmailAndPhoneServices.forEach(s => {
      const des = services[s].description;
      console.log(
        chalk.yellowBright(`[${s}] ${des ? des.substring(0, 30) + "..." : ""}`)
      );
      console.log(chalk.blue(`-`.repeat(40)));
    });
  } catch (e) {
    console.log(chalk.red(e.message));
    throw e;
  }
}

run(root).then(() => console.log("done"), () => process.exit(1));
