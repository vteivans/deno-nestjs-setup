import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { deepReplace } from "./helpers.ts";

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
    alsoNested: {
      nnOne: "nn one",
      nnTwo: 122,
    },
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
        return { ...og, nTwo: 9 };
      },
    });

    expect(res).toEqual({
      ...BASE,
      two: 3,
      list: ["x", "y"],
      nestedObj: {
        ...BASE.nestedObj,
        nOne: "n one",
        nTwo: 9,
      },
    });
  });

  it("Should run replace array", () => {
    const res = deepReplace(BASE, {
      two: 3,
      list: (og) => [...og, "x", "y"],
    });

    expect(res).toEqual({ ...BASE, two: 3, list: [...BASE.list, "x", "y"] });
  });

  it("Should work with Complex array replacement", () => {
    const res = deepReplace(BASE, {
      nestedArrObj: (og) => {
        const base = og[0]!;
        return new Array(10).fill(undefined).map((_, i) => {
          return { ...base, nTwo: i };
        });
      },
    });

    expect(res).toEqual({
      ...BASE,
      nestedArrObj: [
        {
          nOne: "na one",
          nTwo: 0,
        },
        {
          nOne: "na one",
          nTwo: 1,
        },
        {
          nOne: "na one",
          nTwo: 2,
        },
        {
          nOne: "na one",
          nTwo: 3,
        },
        {
          nOne: "na one",
          nTwo: 4,
        },
        {
          nOne: "na one",
          nTwo: 5,
        },
        {
          nOne: "na one",
          nTwo: 6,
        },
        {
          nOne: "na one",
          nTwo: 7,
        },
        {
          nOne: "na one",
          nTwo: 8,
        },
        {
          nOne: "na one",
          nTwo: 9,
        },
      ],
    });
  });

  it("Should do simple deep replace", () => {
    const res = deepReplace(BASE, {
      nestedObj: { alsoNested: { nnOne: "TEST" } },
    });

    expect(res).toEqual({
      ...BASE,
      nestedObj: {
        ...BASE.nestedObj,
        alsoNested: { ...BASE.nestedObj.alsoNested, nnOne: "TEST" },
      },
    });
  });
});
