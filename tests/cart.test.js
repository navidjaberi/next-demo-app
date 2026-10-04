import { describe, expect, it } from "vitest";
import { cartReducer, getTotalCount, getTotalPrice, initialCart } from "../lib/cart";

const pizza = { id: 1, name: "Pizza", price: 12.5 };
const salad = { id: 2, name: "Salad", price: 8.5 };

describe("cartReducer", () => {
  it("adds a new item with quantity 1", () => {
    const state = cartReducer(initialCart, { type: "add", item: pizza });

    expect(state.items).toEqual([{ ...pizza, quantity: 1 }]);
  });

  it("increases quantity when the same item is added again", () => {
    let state = cartReducer(initialCart, { type: "add", item: pizza });
    state = cartReducer(state, { type: "add", item: pizza });

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it("decreases quantity and removes the item when it reaches zero", () => {
    let state = cartReducer(initialCart, { type: "add", item: pizza });
    state = cartReducer(state, { type: "add", item: pizza });

    state = cartReducer(state, { type: "decrease", id: 1 });
    expect(state.items[0].quantity).toBe(1);

    state = cartReducer(state, { type: "decrease", id: 1 });
    expect(state.items).toHaveLength(0);
  });

  it("removes an item completely", () => {
    let state = cartReducer(initialCart, { type: "add", item: pizza });
    state = cartReducer(state, { type: "add", item: salad });
    state = cartReducer(state, { type: "remove", id: 1 });

    expect(state.items).toEqual([{ ...salad, quantity: 1 }]);
  });

  it("clears the cart", () => {
    let state = cartReducer(initialCart, { type: "add", item: pizza });
    state = cartReducer(state, { type: "clear" });

    expect(state.items).toHaveLength(0);
  });

  it("loads saved items", () => {
    const state = cartReducer(initialCart, {
      type: "load",
      items: [{ ...pizza, quantity: 2 }],
    });

    expect(state.loaded).toBe(true);
    expect(state.items[0].quantity).toBe(2);
  });
});

describe("cart totals", () => {
  const items = [
    { ...pizza, quantity: 2 },
    { ...salad, quantity: 1 },
  ];

  it("counts all items", () => {
    expect(getTotalCount(items)).toBe(3);
  });

  it("calculates the total price", () => {
    expect(getTotalPrice(items)).toBe(33.5);
  });

  it("rounds the total price to cents", () => {
    expect(getTotalPrice([{ id: 3, price: 0.1, quantity: 3 }])).toBe(0.3);
  });
});
