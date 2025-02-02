// src/__tests__/ClientTransactionsPagination.test.jsx

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Pagination Feature", () => {
    let transactions;

    const SEARCH_PAYEE = "PROTON AG"; // Define constant for the payee

    beforeAll(async () => {
        transactions = await mockTransactions(); // Wait for CSV data
    });

    test("displays only the first numTxnPerPage transactions by default", async () => {
        render(<ClientTransactions transactions={transactions} />);
        // Get the table body to scope the search
        const tableBody = screen.getByRole("table").querySelector("tbody");

        // Wait for data to load
        await waitFor(() => {
            expect(within(tableBody).getAllByText(SEARCH_PAYEE)[0]).toBeInTheDocument();
        });

        // Should show first 10 transactions only
        for (let i = 0; i < 10; i++) {
            expect(within(tableBody).getAllByText(transactions[i].Payee)[0]).toBeInTheDocument();
        }
        expect(within(tableBody).queryByText((content) => content.includes(transactions[10].Payee))).not.toBeInTheDocument();
    });

    test("updates number of transactions displayed when selecting different page size", async () => {
        render(<ClientTransactions transactions={transactions} />);

        // Wait for table body to render
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Ensure first transaction is loaded
        await waitFor(() => {
            expect(within(tableBody).getAllByText((content) => content.includes(SEARCH_PAYEE))[0]).toBeInTheDocument();
        });

        // Change page size to 20
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });

        await waitFor(() => {
            for (let i = 0; i < 20; i++) {
                expect(within(tableBody).getAllByText((content) => content.includes(transactions[i].Payee))[0]).toBeInTheDocument();
            }
        });
    });

    test("navigates to the next page and displays correct transactions", async () => {
        render(<ClientTransactions transactions={transactions} />);

        // Wait for table body to render
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Ensure first page transactions are displayed
        await waitFor(() => {
            expect(within(tableBody).getAllByText((content) => content.includes(SEARCH_PAYEE))[0]).toBeInTheDocument();
        });

        // Click "Next" button
        fireEvent.click(screen.getByText("2"));

        await waitFor(() => {
            for (let i = 10; i < 20; i++) {
                expect(within(tableBody).getAllByText((content) => content.includes(transactions[i].Payee))[0]).toBeInTheDocument();
            }
        });

        // Ensure transactions from page 1 are NOT present
        expect(within(tableBody).queryByText((content) => content.includes(transactions[0].Payee))).not.toBeInTheDocument();
    });


});
