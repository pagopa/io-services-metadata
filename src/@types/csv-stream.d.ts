declare module "csv-stream" {
  import stream = require("stream");

  export function createStream(options?: unknown): stream.Writable;
}
