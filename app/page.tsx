"use client";

import { useEffect, useState } from "react";

const TRANSACTION_COLUMNS = [
  "id", "date", "quarter", "year", "description", "raw_description",
  "amount", "address", "city_state", "zipcode", "country",
  "Category1", "Category2", "Category3", "amex_category",
  "credit_card", "owner", "payment_method", "payment_processor",
];

type Transaction = Record<string, string | number | null>;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/transactions")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setTransactions(data.transactions ?? []);
        setCount(data.count ?? data.transactions?.length ?? 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Transactions
        </h1>
      </header>

      <main className="p-6">
        {loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
        )}

        {error && (
          <p className="text-sm text-red-500">
            Failed to load transactions: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    {TRANSACTION_COLUMNS.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {transactions.map((row) => (
                    <tr
                      key={row.id as number}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {TRANSACTION_COLUMNS.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                        >
                          {row[col] != null ? String(row[col]) : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-600">
              {count} rows
            </p>
          </>
        )}
      </main>
    </div>
  );
}
