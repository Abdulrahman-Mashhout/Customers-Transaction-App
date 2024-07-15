import React, { useState, useEffect } from "react";
import { Chart as ChartJs } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const TransactionGraph = ({ customerId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsResponse = await axios.get(
          "https://abdulrahman-mashhout.github.io/api-json/transactions.json"
        );
        setTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  // Filter transactions for the selected customer
  const customerTransactions = transactions.filter(
    (transaction) => transaction.customer_id === customerId
  );

  // Aggregate total amount per day
  const totalAmountPerDay = customerTransactions.reduce((acc, transaction) => {
    const date = transaction.date;
    const amount = transaction.amount;
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  // Prepare data for chart
  const chartData = {
    labels: Object.keys(totalAmountPerDay),
    datasets: [
      {
        label: "Total Amount per Day",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: Object.values(totalAmountPerDay),
      },
    ],
  };

  return (
    <div className="max-w-screen-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">
        Total Transaction Amount per Day
      </h2>
      <div className="w-full">
        <div className="relative" style={{ minHeight: "500px" }}>
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false, // Ensure chart responsiveness
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 100, // Customize step size if needed
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionGraph;
