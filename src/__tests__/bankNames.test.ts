import { fromNullable, some } from "fp-ts/lib/Option";
import { readFileSync } from "fs";
import { toCamelCase, IAbi } from "../utils/bankNames";

describe("Test Success Case", () => {
  const updStatusAbi = toCamelCase(JSON.parse(
    readFileSync(__dirname + "/../../status/abi.json").toString()
  ) as IAbi);

  test("Should convert to Capital Case", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08988")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/Ulivi/);
  });

  test("Should preserve hyphens inside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "09506")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/A-tono/);
  });

  test("Should preserve hyphens outside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "01005")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/\s+-\s+SPA/);
  });

  test("Should preserve ampersand outside words", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "03332")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /Passadore & C/
    );
  });

  test("Should preserve accents in lower case", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08883")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(/Società/);
  });

  test("Should preserve double quotes", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08947")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /\"Don Stella\"/
    );
  });

  test("Should transform B.C.C. to BCC", () => {
    const bank = fromNullable(
      updStatusAbi.data.find(myBank => myBank.abi === "08899")
    );
    expect(bank.map(myBank => myBank.name).getOrElse("")).toMatch(
      /BCC Di Treviglio/
    );
  });
});
