import { createStream } from "csv-stream";
import * as es from "event-stream";
import * as fse from "fs-extra";
import request from "request";
import { AmministrazioneIPA } from "./types/AmministrazioneIPA";

const INDICEPA_URL =
  "https://www.indicepa.gov.it/public-services/opendata-read-service.php?dstype=FS&filename=amministrazioni.txt";

const OUT_DIR = `${__dirname}/../amministrazioni`;

console.info("Retrieving indicepa data");

const csvStream = createStream({
  delimiter: "\t"
});

request(INDICEPA_URL) // fetch data from remote URL
  .pipe(csvStream) // parse CSV
  .pipe(
    es.map((entry: AmministrazioneIPA, cb: () => void) => {
      if (entry.cf_validato !== "S") {
        // filter out entries without a validated CF
        return cb();
      }

      if (!entry.Cf || entry.Cf.length < 2 || !entry.Cf.match(/^\d+$/)) {
        // filter out entries with bogus CF
        return cb();
      }

      // strip leading 0s from CF
      const entryCf = entry.Cf.replace(/^0+/, "");

      const fullPath = `${OUT_DIR}/${entryCf[0]}${entryCf[1]}/${entryCf}.json`;

      console.log(`Writing ${fullPath}`);
      return fse.outputJson(fullPath, entry, cb);
    })
  )
  .on("error", console.error);
