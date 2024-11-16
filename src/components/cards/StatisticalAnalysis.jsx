import React, { useMemo } from "react";
import { format, getMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../api/ordersApi";

export default function StatisticalAnalysis() {
    const { data: orders = [], error, isLoading } = useQuery({
        queryKey: ["statisticalAnalysisOrders"],
        queryFn: fetchOrders,
        refetchInterval: 5000,
        staleTime: 10000,
      });
  // Calculate statistics
  const stats = useMemo(() => {
    if (!orders.length) return {};

    const orderValues = orders.map((order) => parseFloat(order.price || 0));
    const totalRevenue = orderValues.reduce((sum, value) => sum + value, 0);
    const averageOrderValue = totalRevenue / orderValues.length;
    const sortedValues = [...orderValues].sort((a, b) => a - b);
    const medianOrderValue =
      sortedValues.length % 2 === 0
        ? (sortedValues[sortedValues.length / 2 - 1] +
            sortedValues[sortedValues.length / 2]) /
          2
        : sortedValues[Math.floor(sortedValues.length / 2)];
    const variance =
      orderValues.reduce((sum, value) => sum + (value - averageOrderValue) ** 2, 0) /
      orderValues.length;
    const standardDeviation = Math.sqrt(variance);

    // Distribution by Month
    const monthlyDistribution = Array(12).fill(0);
    orders.forEach((order) => {
      const month = getMonth(new Date(order.createdAt)); // 0 = January
      monthlyDistribution[month] += 1;
    });

    return {
      totalRevenue,
      averageOrderValue,
      medianOrderValue,
      standardDeviation,
      monthlyDistribution,
    };
  }, [orders]);

  if (!orders.length) {
    return <p>No orders available for analysis.</p>;
  }

  return (
    <div className="text-white">
      <h2>Statistical Analysis</h2>
      <div>
        <h3>Descriptive Statistics</h3>
        <p>Total Revenue: ₱ {stats.totalRevenue.toFixed(2)}</p>
        <p>Average Order Value: ₱ {stats.averageOrderValue.toFixed(2)}</p>
        <p>Median Order Value: ₱ {stats.medianOrderValue.toFixed(2)}</p>
        <p>Standard Deviation: ₱ {stats.standardDeviation.toFixed(2)}</p>
      </div>
      <div>
        <h3>Monthly Distribution</h3>
        <ul>
          {stats.monthlyDistribution.map((count, index) => (
            <li key={index}>
              {format(new Date(2024, index), "MMMM")}: {count} orders
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
