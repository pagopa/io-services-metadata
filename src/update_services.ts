// tslint:disable:no-console

import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter"
import chalk from "chalk";
import * as fs from "fs-extra";
import * as yaml from "js-yaml";
import * as path from "path";

import { Service } from "../definitions/Service";

const Services = t.dictionary(t.string, Service);

async function run(rootPath: string): Promise<void> {
  console.log(chalk.whiteBright("Services builder"));

  const servicesYamlPath = path.join(rootPath, "services.yml");
  console.log("Services YAML:", chalk.blueBright(servicesYamlPath));

  console.log(chalk.gray("[1/2]"), "Reading services data...");
  const servicesYamlContent = await fs.readFile(servicesYamlPath);
  try {
    const servicesYamlData = yaml.safeLoad(servicesYamlContent.toString(), {
      filename: servicesYamlPath,
      strict: true,
      json: false
    });
    const maybeServices = Services.decode(servicesYamlData);
    if (maybeServices.isLeft()) {
      console.log(chalk.red(PathReporter.report(maybeServices).join("\n")));
      throw Error("Invalid services YAML");
    }
    const services = maybeServices.value;
    const serviceIds = Object.keys(services);
    console.log(chalk.greenBright(`Found ${serviceIds.length} service(s).`));

    console.log(chalk.gray("[2/2]"), "Generating services JSON...");
    await Promise.all(serviceIds.map(async serviceId => {
      const servicePath = path.join("services", `${serviceId.toLowerCase()}.json`);
      console.log(chalk.greenBright(servicePath));
      await fs.writeFile(path.join(root, servicePath), JSON.stringify(services[serviceId]));
    }));
  } catch (e) {
    console.log(chalk.red(e.message));
    throw e;
  }
}


const root = path.join(__dirname, "../");

run(root).then(() => console.log("done"), () => process.exit(1));
