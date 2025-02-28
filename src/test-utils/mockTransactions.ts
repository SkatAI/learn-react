// src/test-utils/mockTransactions.ts

import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { Transaction } from "../types";

const mockTransactions = async (): Promise<Transaction[]> => {
    const filePath = path.join(process.cwd(), "src/test-utils/mockTransactions.csv");

    return new Promise((resolve, reject) => {
        const results: Transaction[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data: Transaction) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error: Error) => reject(error));
    });
};

export default mockTransactions;