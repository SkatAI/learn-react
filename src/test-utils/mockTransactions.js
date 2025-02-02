// src/__tests__/mockTransactions.js

// const mockTransactions = [
//     { Date: "2024-02-01", Amount: "50.00", Payee: "Amazon" },
//     { Date: "2024-02-02", Amount: "30.00", Payee: "Netflix" },
//     { Date: "2024-02-03", Amount: "20.00", Payee: "Amazon" },
//     { Date: "2024-02-04", Amount: "100.00", Payee: "Spotify" },
//     { Date: "2024-02-05", Amount: "75.00", Payee: "Apple" },
// ];


import fs from "fs";
import path from "path";
import csv from "csv-parser";

const mockTransactions = async () => {
    const filePath = path.join(process.cwd(), "src/test-utils/mockTransactions.csv");

    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};

export default mockTransactions;
