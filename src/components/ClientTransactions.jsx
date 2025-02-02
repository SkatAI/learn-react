'use client';

import React, { useState, useMemo } from 'react';

function ClientTransactions({ transactions }) {
    const [filterPayee, setFilterPayee] = useState('');

    const filteredTransactions = useMemo(() => {
        if (!filterPayee) return transactions;
        return transactions.filter(transaction =>
            transaction.Payee.toLowerCase().includes(filterPayee.toLowerCase())
        );
    }, [transactions, filterPayee]);

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
                        <th className="p-2 border border-gray-300">Date</th>
                        <th className="p-2 border border-gray-300">Amount</th>
                        <th className="p-2 border border-gray-300">Payee</th>
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