// src/__tests__/ClientTransactionsSorting.test.jsx

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Sorting Feature", () => {
    let transactions;

    beforeAll(async () => {
        transactions = await mockTransactions(); // Load mock transaction data
    });

    const getTableRows = () => {
        const tableBody = screen.getByRole("table").querySelector("tbody");
        return within(tableBody).getAllByRole("row");
    };

    test("sorts transactions by Date in ascending order by default", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Click on the Date column header to sort
        const dateHeader = screen.getByText(/Date/);
        fireEvent.click(dateHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all date cells from the first column
        const rows = getTableRows();
        const dateCells = rows.map(row => within(row).getAllByRole("cell")[0].textContent);
        
        // Check if dates are in ascending order
        const sortedDates = [...dateCells].sort((a, b) => new Date(a) - new Date(b));
        expect(dateCells).toEqual(sortedDates);
    });

    test("toggles Date sorting between ascending and descending", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // First click - ascending order
        const dateHeader = screen.getByText(/Date/);
        fireEvent.click(dateHeader);
        
        // Second click - descending order
        fireEvent.click(dateHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all date cells from the first column
        const rows = getTableRows();
        const dateCells = rows.map(row => within(row).getAllByRole("cell")[0].textContent);
        
        // Check if dates are in descending order
        const sortedDates = [...dateCells].sort((a, b) => new Date(b) - new Date(a));
        expect(dateCells).toEqual(sortedDates);
    });

    test("sorts transactions by Amount in ascending order", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Click on the Amount column header to sort
        const amountHeader = screen.getByText(/Amount/);
        fireEvent.click(amountHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all amount cells from the second column
        const rows = getTableRows();
        const amountCells = rows.map(row => parseFloat(within(row).getAllByRole("cell")[1].textContent));
        
        // Check if amounts are in ascending order
        const sortedAmounts = [...amountCells].sort((a, b) => a - b);
        expect(amountCells).toEqual(sortedAmounts);
    });

    test("toggles Amount sorting between ascending and descending", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // First click - ascending order
        const amountHeader = screen.getByText(/Amount/);
        fireEvent.click(amountHeader);
        
        // Second click - descending order
        fireEvent.click(amountHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all amount cells from the second column
        const rows = getTableRows();
        const amountCells = rows.map(row => parseFloat(within(row).getAllByRole("cell")[1].textContent));
        
        // Check if amounts are in descending order
        const sortedAmounts = [...amountCells].sort((a, b) => b - a);
        expect(amountCells).toEqual(sortedAmounts);
    });

    test("sorts transactions by Payee in alphabetical order", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Click on the Payee column header to sort
        const payeeHeader = screen.getByText(/Payee/);
        fireEvent.click(payeeHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all payee cells from the third column
        const rows = getTableRows();
        const payeeCells = rows.map(row => within(row).getAllByRole("cell")[2].textContent);
        
        // Check if payees are in alphabetical order
        const sortedPayees = [...payeeCells].sort();
        expect(payeeCells).toEqual(sortedPayees);
    });

    test("toggles Payee sorting between ascending and descending", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // First click - ascending order
        const payeeHeader = screen.getByText(/Payee/);
        fireEvent.click(payeeHeader);
        
        // Second click - descending order
        fireEvent.click(payeeHeader);
        
        // Wait for sorting to complete
        await waitFor(() => {
            const rows = getTableRows();
            expect(rows.length).toBeGreaterThan(0);
        });
        
        // Get all payee cells from the third column
        const rows = getTableRows();
        const payeeCells = rows.map(row => within(row).getAllByRole("cell")[2].textContent);
        
        // Check if payees are in reverse alphabetical order
        const sortedPayees = [...payeeCells].sort().reverse();
        expect(payeeCells).toEqual(sortedPayees);
    });
});