import { describe, it } from "@std/testing/bdd";
import { deepReplace } from "./helpers.ts";
import { expect } from "@std/expect/expect";
import { basename } from "node:path";

const BASE = {
  one: "one",
  two: 2,
  list: [
    "first",
    "second",
    "third",
  ],
  nestedObj: {
    nOne: "n one",
    nTwo: 12,
  },
  nestedArrObj: [
    {
      nOne: "na one",
      nTwo: 212,
    },
    {
      nOne: "na one",
      nTwo: 222,
    },
  ],
};

describe("Deep Object Replacer", () => {
  it("Should run", () => {
    const res = deepReplace(BASE, {
      two: 3,
      list: ["x", "y"],
      nestedObj: (og) => {
        return { ...og, nTwo: "Test" };
      },
    });

    expect(res).toEqual({
      ...BASE,
      two: 3,
      list: ["x", "y"],
      nestedObj: {
        nOne: "n one",
        nTwo: "Test",
      }
    });
  });

  it("Should run replace array", () => {
    const res = deepReplace(BASE, {
      two: 3,
      list: (og) => [...og, "x", "y"],
    });

    expect(res).toEqual({ ...BASE, two: 3, list: [...BASE.list, "x", "y"] });
  });
});
