import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../api/ordersApi";
import { format, isSameMonth, isSameYear } from "date-fns";
import { Spinner } from "react-bootstrap";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

export default function ReportsCard() {
  const componentRef = useRef();
  const { data: orders = [], error, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    refetchInterval: 5000,
    staleTime: 10000,
  });

  const currentMonth = new Date();

  // Monthly Orders
  const monthlyOrders = orders.filter(
    (order) =>
      isSameMonth(new Date(order.createdAt), currentMonth) &&
      order.rider &&
      (order.status === "Delivered" || order.status === "To Ship")
  );

  // Yearly Orders with Debugging
  const yearlyOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const isSameYearOrder = isSameYear(orderDate, new Date());
    return (
      isSameYearOrder &&
      order.rider &&
      (order.status === "Delivered" || order.status === "To Ship")
    );
  });

  console.log("All Orders:", orders);
  console.log("Yearly Orders:", yearlyOrders); // Check if any orders match yearly filter

  // Total Sales Calculations
  const totalOrderSales = monthlyOrders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0);
  const totalYearlySales = yearlyOrders.reduce((sum, order) => sum + parseFloat(order.price || 0), 0);

  // Delivery and Profit Calculations
  const totalDeliverySales = monthlyOrders.length * 60;
  const profitPercentage = 0.12;
  const totalOrderProfit = totalOrderSales * profitPercentage;
  const totalDeliveryProfit = totalDeliverySales * profitPercentage;

  // Top Sale Calculation
  const topSale = monthlyOrders.reduce((max, order) => Math.max(max, parseFloat(order.price || 0)), 0);

  const exportToExcel = () => {
    const data = orders.map((order) => ({
      OrderID: order._id ?? "",
      Date: format(new Date(order.createdAt), "yyyy-MM-dd") ?? "",
      Price: parseFloat(order.price || 0) ?? 0,
      Quantity: order.quantity ?? "",
      Status: order.status ?? "",
      User: (order.user.firstName + " " + order.user.lastName),
      Rider: order.rider ? "Assigned" : "Unassigned",
      RiderName: order.rider ? (order.rider.firstName + " " + order.rider.lastName) : ""
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "Report.xlsx");
  };

  if (isLoading) return <Spinner color="dark" />;

  if (error) {
    return (
      <div className="text-white">Error loading reports: {error.message}</div>
    );
  }

  return (
    <div ref={componentRef} className="text-white">
      <h4>Monthly Report - {format(currentMonth, "MMMM yyyy")}</h4>
      {monthlyOrders.length === 0 ? (
        <p>No orders for this month yet.</p>
      ) : (
        <div>
          <p>Total Order Sales: ₱ {totalOrderSales.toFixed(2)}</p>
          <p>Total Delivery Sales: ₱ {totalDeliverySales.toFixed(2)}</p>
          <p>Total Order Profit (12%): ₱ {totalOrderProfit.toFixed(2)}</p>
          <p>Total Delivery Profit (12%): ₱ {totalDeliveryProfit.toFixed(2)}</p>
          <p>Top Sale This Month: ₱ {topSale.toFixed(2)}</p>
          <p>Yearly Total Sales: ₱ {totalYearlySales.toFixed(2)}</p>
        </div>
      )}
      <button onClick={exportToExcel} className="btn btn-primary mt-3">Download Excel Report</button>
    </div>
  );
}
