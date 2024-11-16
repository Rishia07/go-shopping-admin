import React, { useMemo } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../../api/ordersApi";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PieController, ArcElement, LineElement, PointElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Analysis() {

    const { data: orders = [], error, isLoading } = useQuery({
        queryKey: ["analysisOrders"],
        queryFn: fetchOrders,
        refetchInterval: 5000,
        staleTime: 10000,
      });
  // Data processing
  
  const monthlyData = useMemo(() => {
    const months = Array(12).fill(0); // Initialize months array [Jan-Dec]
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth(); // 0 = January, 11 = December
      months[month] += parseFloat(order.price || 0);
    });
    return months;
  }, [orders]);

  const topProducts = useMemo(() => {
    const productSales = {};
    orders.forEach((order) => {
      const productName = order.product?.title || "Unknown Product";
      productSales[productName] = (productSales[productName] || 0) + parseFloat(order.price || 0);
    });
    return Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5); // Top 5 products
  }, [orders]);

  const categoryData = useMemo(() => {
    const categories = {};
    orders.forEach((order) => {
      const category = order.product?.category || "Unknown";
      categories[category] = (categories[category] || 0) + parseFloat(order.price || 0);
    });
    return categories;
  }, [orders]);

  // Chart data
  const monthlyChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Sales (₱)",
        data: monthlyData,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const topProductsChartData = {
    labels: topProducts.map(([product]) => product),
    datasets: [
      {
        label: "Top Products (₱)",
        data: topProducts.map(([, sales]) => sales),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>Order Analysis</h2>
      <div>
        <h3>Monthly Sales</h3>
        <Line data={monthlyChartData} />
      </div>
      <div>
        <h3>Top Products</h3>
        <Bar data={topProductsChartData} />
      </div>
      <div>
        <h3>Category Distribution</h3>
        <Pie data={categoryChartData} />
      </div>
    </div>
  );
}
