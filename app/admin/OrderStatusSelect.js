"use client";

import { useState, useTransition } from "react";
import { orderStatuses } from "@/lib/orders";
import { updateOrderStatus } from "./actions";

export default function OrderStatusSelect({ orderId, status }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const newStatus = event.target.value;
    const oldStatus = value;
    setValue(newStatus);

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.error) {
        setValue(oldStatus);
      }
    });
  }

  return (
    <select
      className="input"
      value={value}
      onChange={handleChange}
      disabled={isPending}
      style={{ width: "auto", textTransform: "capitalize" }}
      aria-label={`Status of order ${orderId}`}
    >
      {orderStatuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
