export const initialCart = { items: [], loaded: false };

export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((item) => item.id === action.item.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.item.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }

    case "decrease": {
      const existing = state.items.find((item) => item.id === action.id);

      if (!existing) {
        return state;
      }

      if (existing.quantity === 1) {
        return { ...state, items: state.items.filter((item) => item.id !== action.id) };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item
        ),
      };
    }

    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };

    case "clear":
      return { ...state, items: [] };

    case "load":
      return { items: action.items, loaded: true };

    default:
      return state;
  }
}

export function getTotalCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getTotalPrice(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
}
