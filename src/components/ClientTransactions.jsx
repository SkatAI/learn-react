'use client';

import React, { useState, useMemo } from 'react';

function ClientTransactions({ transactions }) {
    const [filterPayee, setFilterPayee] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Function to handle sorting
    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            // Toggle sorting direction if the same column is clicked
            if (prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    // Sorting logic
    const sortedTransactions = useMemo(() => {
        if (!sortConfig.key) return transactions;
        return [...transactions].sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Convert to numbers if sorting by Amount
            if (sortConfig.key === 'Amount') {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            }

            // Convert to Date object if sorting by Date
            if (sortConfig.key === 'Date') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [transactions, sortConfig]);

    // Filtering logic
    const filteredTransactions = useMemo(() => {
        if (!filterPayee) return sortedTransactions;
        return sortedTransactions.filter(transaction =>
            transaction.Payee.toLowerCase().includes(filterPayee.toLowerCase())
        );
    }, [sortedTransactions, filterPayee]);

    // Compute total amount
    const totalAmount = useMemo(() => {
        return filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0);
    }, [filteredTransactions]);

    if (!transactions || transactions.length === 0) {
        return <p>No transactions data available.</p>;
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Filter by Payee"
                value={filterPayee}
                onChange={(e) => setFilterPayee(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
            />

            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => handleSort('Date')}>
                            Date {sortConfig.key === 'Date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => handleSort('Amount')}>
                            Amount {sortConfig.key === 'Amount' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="p-2 border border-gray-300 cursor-pointer" onClick={() => handleSort('Payee')}>
                            Payee {sortConfig.key === 'Payee' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-gray-300">
                            <td className="p-2 border border-gray-300">{transaction.Date}</td>
                            <td className="p-2 border border-gray-300">{transaction.Amount}</td>
                            <td className="p-2 border border-gray-300">{transaction.Payee}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold">
                        <td className="p-2 border border-gray-300">Total</td>
                        <td className="p-2 border border-gray-300">{totalAmount.toFixed(2)}</td>
                        <td className="p-2 border border-gray-300"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default ClientTransactions;
