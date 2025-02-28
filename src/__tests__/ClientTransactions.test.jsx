// src/__tests__/ClientTransactions.test.jsx

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Filtering Feature", () => {
    let transactions;

    const SEARCH_PAYEE = "PROTON AG"; // Define constant for an existing payee
    const PAYEE_NOTFOUND = "SomethingThatDoesNotExist"; // Define constant for a non-existent payee
    const AMOUNT_THRESHOLD = "50"; // Define threshold for amount filter tests
    const HIGH_AMOUNT_PAYEE = "Garmin"; // A payee with a large transaction amount
    const LOW_AMOUNT_PAYEE = "RATP"; // A payee with a small transaction amount

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

    test("filters transactions based on amount threshold", async () => {
        render(<ClientTransactions transactions={transactions} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });

        // Get the table body
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Type in the amount threshold input
        const thresholdInput = screen.getByPlaceholderText("Amount Threshold");
        fireEvent.change(thresholdInput, { target: { value: AMOUNT_THRESHOLD } });

        // Wait for filtering to complete
        await waitFor(() => {
            // High amount transactions should be visible
            expect(within(tableBody).queryByText(HIGH_AMOUNT_PAYEE)).toBeInTheDocument();
        });

        // Check that low amount transactions are not displayed
        const lowAmountTransactions = within(tableBody).queryAllByText(LOW_AMOUNT_PAYEE);
        expect(lowAmountTransactions.length).toBe(0);

        // Verify that only transactions with amounts >= threshold are shown
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const amountCell = row.querySelectorAll('td')[1];
            const amount = parseFloat(amountCell.textContent);
            expect(Math.abs(amount)).toBeGreaterThanOrEqual(parseFloat(AMOUNT_THRESHOLD));
        });
    });

    test("combines payee and amount threshold filters", async () => {
        render(<ClientTransactions transactions={transactions} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });

        // Get the table body
        const tableBody = await waitFor(() => screen.getByRole("table").querySelector("tbody"));

        // Type in the payee filter
        const payeeInput = screen.getByPlaceholderText("Filter by Payee");
        fireEvent.change(payeeInput, { target: { value: "MR" } });

        // Type in the amount threshold input
        const thresholdInput = screen.getByPlaceholderText("Amount Threshold");
        fireEvent.change(thresholdInput, { target: { value: AMOUNT_THRESHOLD } });

        // Verify that only transactions that match both filters are shown
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const payeeCell = row.querySelectorAll('td')[2];
            const amountCell = row.querySelectorAll('td')[1];
            
            const payeeText = payeeCell.textContent;
            const amount = parseFloat(amountCell.textContent);
            
            expect(payeeText).toMatch(/MR/i);
            expect(Math.abs(amount)).toBeGreaterThanOrEqual(parseFloat(AMOUNT_THRESHOLD));
        });
    });
});
