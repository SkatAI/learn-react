// app/transactions/page.tsx

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import React from 'react';

import ThemeToggleButton from '../../components/ThemeToggleButton';
import ClientTransactions from '../../components/ClientTransactions';
import LogoutButton from '../../components/LogoutButton';
import ProtectedContent from './protected-content';
import { Transaction } from '../../types';

async function parseCSV(): Promise<Transaction[]> {
    const filePath = path.join(process.cwd(), 'public/data/transactions.csv');

    return new Promise((resolve, reject) => {
        const results: Transaction[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data: Transaction) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error: Error) => reject(error));
    });
}

export default async function TransactionsPage(): Promise<React.ReactElement> {
    let transactions: Transaction[] = [];

    try {
        transactions = await parseCSV();
    } catch (error) {
        console.error('Error loading transactions data:', error);
        // Handle the error more gracefully, perhaps show an error message
    }

    return (
        <ProtectedContent>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1>Transactions</h1>
                    <div className="flex gap-4">
                        <ThemeToggleButton />
                        <LogoutButton />
                    </div>
                </div>
                <ClientTransactions transactions={transactions} />
            </div>
        </ProtectedContent>
    );
}