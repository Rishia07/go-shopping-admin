import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../api/ordersApi";
import { format, isSameMonth } from "date-fns";
import { Spinner } from "react-bootstrap";

export default function ReportsCard() {
  const {
    data: orders = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    staleTime: 10000,
  });

  const currentMonth = new Date();
  const monthlyOrders = orders.filter(
    (order) =>
      isSameMonth(new Date(order.createdAt), currentMonth) &&
      order.rider &&
      (order.status === "Delivered" || order.status === "To Ship")
  );

  const totalOrders = monthlyOrders.length;

  const totalOrderSales = monthlyOrders.reduce((sum, order) => {
    const amount = parseFloat(order.price) || 0;
    return sum + amount;
  }, 0);

  const totalDeliverySales = totalOrders * 60;

  const profitPercentage = 0.12;
  const totalOrderProfit = totalOrderSales * profitPercentage;
  const totalDeliveryProfit = totalDeliverySales * profitPercentage;

  if (isLoading) return <Spinner color="dark" />;

  if (error) {
    return (
      <div className="text-white">Error loading reports: {error.message}</div>
    );
  }

  return (
    <div className="text-white">
      <h4>Monthly Report - {format(currentMonth, "MMMM yyyy")}</h4>
      {totalOrders === 0 ? (
        <p>No orders for this month yet.</p>
      ) : (
        <div>
          <p>Total Order Sales: ₱ {totalOrderSales.toFixed(2)}</p>
          <p>Total Delivery Sales: ₱ {totalDeliverySales.toFixed(2)}</p>
          <p>Total Order Profit (12%): ₱ {totalOrderProfit.toFixed(2)}</p>
          <p>Total Delivery Profit (12%): ₱ {totalDeliveryProfit.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
