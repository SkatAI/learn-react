// src/__tests__/ClientTransactions.test.jsx

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Filtering Feature", () => {
    let transactions;

    const SEARCH_PAYEE = "PROTON AG"; // Define constant for an existing payee
    const PAYEE_NOTFOUND = "SomethingThatDoesNotExist"; // Define constant for a non-existent payee

    beforeAll(async () => {
        transactions = await mockTransactions(); // Wait for CSV data
        console.log("Sample transaction:", transactions[0]); // Print first transaction
    });

    test("renders all transactions initially", async () => {
        render(<ClientTransactions transactions={transactions} />);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });

        // Get the table body after it renders
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Wait for at least one transaction to be in the table
        await waitFor(() => {
            expect(within(tableBody).queryAllByText((content) => content.includes(transactions[0].Payee.trim()))[0]).toBeInTheDocument();
        });

        // Ensure all transactions are visible
        transactions.slice(0, 20).forEach(transaction => {
            // console.log("Sample transaction:", transaction);
            expect(within(tableBody).queryAllByText((content) => content.includes(transaction.Payee.trim()))[0]).toBeInTheDocument();
        });
    });

    test("filters transactions based on Payee input", async () => {
        render(<ClientTransactions transactions={transactions} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "10" } });

        // Get the table body
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Type in the search input to filter
        const input = screen.getByPlaceholderText("Filter by Payee");
        fireEvent.change(input, { target: { value: SEARCH_PAYEE } });

        await waitFor(() => {
            expect(within(tableBody).getAllByText((content) => content.includes(SEARCH_PAYEE))[0]).toBeInTheDocument();
        });

        // Ensure other payees are NOT present
        transactions
            .slice(0, 10)
            .filter(t => t.Payee !== SEARCH_PAYEE)
            .forEach(t => {
                console.log("Sample transaction:", t);
                expect(within(tableBody).queryByText((content) => content.includes(t.Payee))).not.toBeInTheDocument();
            });
    });

    test("displays no results when filtering for a nonexistent payee", async () => {
        render(<ClientTransactions transactions={transactions} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "10" } });

        // Get the table body
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Type in the search input
        const input = screen.getByPlaceholderText("Filter by Payee");
        fireEvent.change(input, { target: { value: PAYEE_NOTFOUND } });

        await waitFor(() => {
            expect(within(tableBody).queryByText((content) => content.includes(PAYEE_NOTFOUND))).not.toBeInTheDocument();
        });

        // Ensure no rows are displayed
        expect(tableBody.childElementCount).toBe(0);
    });
});
