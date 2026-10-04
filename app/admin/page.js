import Link from "next/link";
import { getAllOrders } from "@/lib/foods";
import { formatDate, formatPrice } from "@/lib/format";
import { orderStatuses } from "@/lib/orders";
import OrderStatusSelect from "./OrderStatusSelect";
import styles from "./admin.module.css";

export default async function AdminOrdersPage({ searchParams }) {
  const { status = "" } = await searchParams;
  const allOrders = await getAllOrders();

  const orders = status
    ? allOrders.filter((order) => order.status === status)
    : allOrders;

  const pendingCount = allOrders.filter((order) => order.status === "pending").length;
  const revenue = allOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const stats = [
    { label: "Total orders", value: allOrders.length },
    { label: "Waiting", value: pendingCount },
    { label: "Revenue", value: formatPrice(revenue) },
  ];

  return (
    <>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={`card ${styles.stat}`}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.filters}>
        <Link href="/admin" className={!status ? styles.activeFilter : styles.filter}>
          All
        </Link>
        {orderStatuses.map((item) => (
          <Link
            key={item}
            href={`/admin?status=${item}`}
            className={status === item ? styles.activeFilter : styles.filter}
          >
            {item}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="empty-state">No orders here.</p>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <div key={order.id} className={`card ${styles.order}`}>
              <div className={styles.orderInfo}>
                <strong>Order #{order.id}</strong>
                <span className={styles.muted}>
                  {order.profiles?.full_name || "Customer"} · {formatDate(order.created_at)}
                </span>
                <span className={styles.items}>
                  {order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}
                </span>
              </div>
              <strong className={styles.total}>{formatPrice(order.total)}</strong>
              <OrderStatusSelect orderId={order.id} status={order.status} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
