import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionGraph from "./TransactionGraph";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterAmount, setFilterAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await axios.get(
          "https://abdulrahman-mashhout.github.io/api-json/customers.json"
        );
        const transactionsResponse = await axios.get(
          "https://abdulrahman-mashhout.github.io/api-json/transactions.json"
        );
        setCustomers(customersResponse.data.customers);
        setTransactions(transactionsResponse.data.transactions);
        setFilteredTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = () => {
    if (filterName && !filterAmount) {
      let filteredData = transactions.filter((transaction) =>
        customers
          .find((customer) => customer.id == transaction.customer_id)
          ?.name.toLowerCase()
          .includes(filterName.toLowerCase())
      );
      setFilteredTransactions(filteredData);
    } else if (!filterName && filterAmount) {
      let filteredData = transactions.filter(
        (transaction) => filterAmount == transaction.amount
      );
      setFilteredTransactions(filteredData);
    } else if (filterName && filterAmount) {
      let filteredData = transactions.filter(
        (transaction) =>
          customers
            .find((customer) => customer.id == transaction.customer_id)
            ?.name.toLowerCase()
            .includes(filterName.toLowerCase()) &&
          filterAmount == transaction.amount
      );
      setFilteredTransactions(filteredData);
    }
  };

  const clearFilters = () => {
    setFilterName("");
    setFilterAmount("");
    setFilteredTransactions(transactions);
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">
        Customer Transactions
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-center mb-4 space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="Filter by Customer Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="Filter by Transaction Amount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  {
                    customers.find(
                      (customer) => customer.id == transaction.customer_id
                    )?.name
                  }
                </td>
                <td className="border px-4 py-2">{transaction.date}</td>
                <td className="border px-4 py-2">{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredTransactions.length > 0 && (
        <TransactionGraph customerId={filteredTransactions[0].customer_id} />
      )}
    </div>
  );
};

export default CustomerTable;
