'use client';

import React, { useState, useMemo } from 'react';

function ClientTransactions({ transactions }) {
    const [filterPayee, setFilterPayee] = useState('');
    const [amountThreshold, setAmountThreshold] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [numTxnPerPage, setNumTxnPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (key) => {
        setSortConfig((prevConfig) => {
            if (prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const sortedTransactions = useMemo(() => {
        if (!sortConfig.key) return transactions;
        return [...transactions].sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            if (sortConfig.key === 'Amount') {
                valA = parseFloat(valA) || 0;
                valB = parseFloat(valB) || 0;
            }

            if (sortConfig.key === 'Date') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [transactions, sortConfig]);

    const filteredTransactions = useMemo(() => {
        let filtered = sortedTransactions;
        
        // Filter by payee if provided
        if (filterPayee) {
            filtered = filtered.filter(transaction =>
                transaction.Payee.toLowerCase().includes(filterPayee.toLowerCase())
            );
        }
        
        // Filter by amount threshold if provided
        if (amountThreshold && !isNaN(parseFloat(amountThreshold))) {
            const threshold = parseFloat(amountThreshold);
            filtered = filtered.filter(transaction => {
                const amount = parseFloat(transaction.Amount);
                return Math.abs(amount) >= threshold;
            });
        }
        
        return filtered;
    }, [sortedTransactions, filterPayee, amountThreshold]);

    const totalPages = Math.ceil(filteredTransactions.length / numTxnPerPage);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * numTxnPerPage;
        return filteredTransactions.slice(startIndex, startIndex + numTxnPerPage);
    }, [filteredTransactions, numTxnPerPage, currentPage]);

    const totalAmount = useMemo(() => {
        return filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0);
    }, [filteredTransactions]);

    const goToPage = (page) => setCurrentPage(page);

    // Generate pagination numbers with unique keys
    const renderPagination = () => {
        if (totalPages <= 6) {
            return [...Array(totalPages)].map((_, i) => (
                <button
                    key={`page-${i + 1}`}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-white'}`}
                >
                    {i + 1}
                </button>
            ));
        }

        let pages = new Set(); // Use Set to avoid duplicates
        pages.add(1);
        if (currentPage > 3) pages.add('ellipsis-1');
        if (currentPage > 2) pages.add(currentPage - 1);
        pages.add(currentPage);
        if (currentPage < totalPages - 1) pages.add(currentPage + 1);
        if (currentPage < totalPages - 2) pages.add('ellipsis-2');
        pages.add(totalPages);

        return Array.from(pages).map((page, i) => {
            if (typeof page === 'string' && page.includes('ellipsis')) {
                return <span key={`ellipsis-${i}`} className="px-3 py-1">...</span>;
            }
            return (
                <button
                    key={`page-${page}`}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:text-white'}`}
                >
                    {page}
                </button>
            );
        });
    };

    if (!transactions || transactions.length === 0) {
        return <p>No transactions data available.</p>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filter by Payee"
                    value={filterPayee}
                    onChange={(e) => setFilterPayee(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                />
                
                <input
                    type="number"
                    placeholder="Amount Threshold"
                    value={amountThreshold}
                    onChange={(e) => {
                        setAmountThreshold(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    min="0"
                    step="any"
                />

                <select
                    value={numTxnPerPage}
                    onChange={(e) => {
                        setNumTxnPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>

            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="p-2 border border-gray-300 dark:border-gray-600 cursor-pointer dark:text-white" onClick={() => handleSort('Date')}>
                            Date {sortConfig.key === 'Date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 cursor-pointer dark:text-white" onClick={() => handleSort('Amount')}>
                            Amount {sortConfig.key === 'Amount' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th className="p-2 border border-gray-300 dark:border-gray-600 cursor-pointer dark:text-white" onClick={() => handleSort('Payee')}>
                            Payee {sortConfig.key === 'Payee' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTransactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-gray-300 dark:border-gray-600">
                            <td className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white">{transaction.Date}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white">{transaction.Amount}</td>
                            <td className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white">{transaction.Payee}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold">
                        <td className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white">Total</td>
                        <td className="p-2 border border-gray-300 dark:border-gray-600 dark:text-white">{totalAmount.toFixed(2)}</td>
                        <td className="p-2 border border-gray-300 dark:border-gray-600"></td>
                    </tr>
                </tfoot>
            </table>

            {/* Pagination Navigation */}
            <div className="flex justify-center mt-4 gap-2">
                {renderPagination()}
            </div>
        </div>
    );
}

export default ClientTransactions;
