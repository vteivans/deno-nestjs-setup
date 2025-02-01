type Replacer<T> = T | ((_: T) => T);

type Replacement<T> = T extends Array<unknown> ? Replacer<T>
  : T extends object ? {
      [Key in keyof T]?:
        | Replacement<T[Key]>
        | ((_: T[Key]) => Replacement<T[Key]>);
    }
  : Replacer<T>;

export function deepReplace<T>(
  source: T,
  replacement: Replacement<T>,
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
      return replacement as T;
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
          res[key as keyof typeof res] = deepReplace(
            res[key as keyof typeof res],
            value,
          );
        } else {
          console.warn("unknown key", key);
        }
      }
      return res;
    }
    throw new Error("Replacement must match the source type of be a function");
    // see what's in replacer, replace each prop
  }

  return replacement as T;
}
