import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchOrders } from "../../api/ordersApi";
import { FormSelect } from "react-bootstrap";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SalesChart() {
  const [timeFrame, setTimeFrame] = useState("daily");

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

  const processData = () => {
    const quantities = {};

    const filteredOrders = orders.filter(
      (order) =>
        order.rider &&
        (order.status === "Delivered" || order.status === "To Ship")
    );

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      let label;

      if (timeFrame === "daily") {
        label = date.toLocaleDateString();
      } else if (timeFrame === "weekly") {
        label = `Week of ${date.toLocaleDateString()}`;
      } else if (timeFrame === "monthly") {
        label = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      }

      if (!quantities[label]) {
        quantities[label] = 0;
      }
      quantities[label] += order.quantity;
    });

    return {
      labels: Object.keys(quantities),
      datasets: [
        {
          label: "Sales Quantity",
          data: Object.values(quantities),
          backgroundColor: "#198754",
        },
      ],
    };
  };

  const chartData = processData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="m-4">
      <div className="mb-4" style={{ maxWidth: 500 }}>
        <FormSelect
          size="lg"
          id="timeFrameSelect"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </FormSelect>
      </div>

      {isLoading ? (
         <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error.message}</p>
      ) : chartData.labels.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No delivered orders yet</p>
      )}
    </div>
  );
}
