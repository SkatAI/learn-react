// components/ClientTransactions.jsx

'use client';

import React from 'react';


function ClientTransactions({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return <p>No transactions data available.</p>;
    }

    return (
        <div>
            {transactions.map((transaction, index) => (
                <div key={index}>
                    <p>
                        Date: {transaction.Date}, Amount: {transaction.Amount}, Payee: {transaction.Payee}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default ClientTransactions;