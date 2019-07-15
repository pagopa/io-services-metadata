import request from "request";
import parse from "csv-parse";
import stream = require("stream");

const ELENCO_COMUNI_ITALIANI_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";

const parserOption = {
  skip_empty_lines: true,
  relax: true,
  delimiter: ";",
  skip_lines_with_error: true,
  from_line: 4
};

async function run() {
  const options = {
    url: ELENCO_COMUNI_ITALIANI_URL,
    encoding: null
  };
  request.get(options, (error: any, response: request.Response, body: any) => {
    console.log("A");
    const buffer = Buffer.from(body);
    const csvContent = buffer.toString("latin1");
    parse(
      csvContent,
      parserOption,
      (err: Error | undefined, records: any | undefined, info: parse.Info) => {
        console.log("SONO QUI:" + err);
        console.log(records.length);
        console.log(records[0]);
      }
    );
  });
  await Promise.resolve();
}

run().then(() => console.log("done"), () => process.exit(1));
