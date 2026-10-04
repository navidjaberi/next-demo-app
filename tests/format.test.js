import { describe, expect, it } from "vitest";
import { formatPrice } from "../lib/format";

describe("formatPrice", () => {
  it("shows two decimals", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
  });

  it("works with strings from the database", () => {
    expect(formatPrice("8")).toBe("$8.00");
  });
});
