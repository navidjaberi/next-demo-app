import { describe, expect, it } from "vitest";
import { addRating, getAverageRating } from "../lib/rating";

describe("getAverageRating", () => {
  it("returns 0 when there are no reviews", () => {
    expect(getAverageRating([])).toBe(0);
    expect(getAverageRating(undefined)).toBe(0);
  });

  it("rounds the average to one decimal", () => {
    expect(getAverageRating([{ rating: 5 }, { rating: 4 }, { rating: 4 }])).toBe(4.3);
  });
});

describe("addRating", () => {
  it("adds rating and review count and removes the reviews list", () => {
    const food = { id: 1, name: "Pizza", reviews: [{ rating: 5 }, { rating: 3 }] };

    expect(addRating(food)).toEqual({ id: 1, name: "Pizza", rating: 4, reviewCount: 2 });
  });
});
