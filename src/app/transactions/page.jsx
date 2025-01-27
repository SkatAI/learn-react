// app/transactions/page.jsx

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

import ClientTransactions from '../../components/ClientTransactions';

async function parseCSV() {
    const filePath = path.join(process.cwd(), 'public/data/transactions.csv');

    return new Promise((resolve, reject) => {
        // Remove the type annotation
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

export default async function TransactionsPage() {
    let transactions = [];

    try {
        transactions = await parseCSV();
    } catch (error) {
        console.error('Error loading transactions data:', error);
        // Handle the error more gracefully, perhaps show an error message
    }

    return (
        <div>
            <h1>Transactions</h1>
            <ClientTransactions transactions={transactions} />
        </div>
    );
}