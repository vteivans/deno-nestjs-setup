export function deepReplace<
  // deno-lint-ignore no-explicit-any
  T extends Record<keyof any, unknown> | Array<unknown>,
>(
  source: T,
  replacement: Partial<T>,
  options: { assign: boolean } = { assign: false },
): T {
  if (!source || !replacement) {
    return source;
  }

  if (replacement instanceof Function) {
    return replacement(source);
  }

  if (Array.isArray(source)) {
    // Validate replacement
    if (Array.isArray(replacement)) {
      return replacement;
    }

    throw new Error("Replacement must match the source type of be a function");
    // see what's in the replacement
    // Go over each object and apply replacement
  }

  if (typeof source === "object") {
    // Validate replacement
    if (typeof replacement === "object") {
      const res = options.assign ? source : { ...source };

      for (const [key, value] of Object.entries(replacement)) {
        if (key in res) {
          res[key] = deepReplace(res[key], value);
        } else {
          console.warn("unknown key", key);
        }
      }
      return res;
    }
    throw new Error("Replacement must match the source type of be a function");
    // see what's in replacer, replace each prop
  }

  return replacement;
}
