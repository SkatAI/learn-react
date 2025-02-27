// src/__tests__/ClientTransactionsTotals.test.jsx

import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Total Calculation Feature", () => {
    let transactions;

    beforeAll(async () => {
        transactions = await mockTransactions(); // Load mock transaction data
    });

    test("calculates and displays the correct total for all transactions", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Wait for transactions to load
        await waitFor(() => {
            expect(screen.getByText("Total")).toBeInTheDocument();
        });

        // Calculate expected total
        const expectedTotal = transactions
            .reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0)
            .toFixed(2);
        
        // Find the total cell in the footer
        const totalCell = screen.getByText("Total")
            .closest("tr")
            .querySelector("td:nth-child(2)");
        
        // Check if displayed total matches calculated total
        expect(totalCell.textContent).toBe(expectedTotal);
    });

    test("updates total amount when filtering transactions", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Select a specific payee for filtering
        const filterPayee = "PROTON AG";
        
        // Type in the search input to filter
        const input = screen.getByPlaceholderText("Filter by Payee");
        fireEvent.change(input, { target: { value: filterPayee } });
        
        // Calculate expected total for filtered transactions
        const filteredTotal = transactions
            .filter(transaction => transaction.Payee.includes(filterPayee))
            .reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0)
            .toFixed(2);
        
        // Wait for totals to update after filtering
        await waitFor(() => {
            const totalCell = screen.getByText("Total")
                .closest("tr")
                .querySelector("td:nth-child(2)");
            expect(totalCell.textContent).toBe(filteredTotal);
        });
    });

    test("updates total when changing page size (stays the same)", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Wait for initial render
        await waitFor(() => {
            expect(screen.getByText("Total")).toBeInTheDocument();
        });
        
        // Get the initial total
        const initialTotalCell = screen.getByText("Total")
            .closest("tr")
            .querySelector("td:nth-child(2)");
        const initialTotal = initialTotalCell.textContent;
        
        // Change page size
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
        
        // Verify total remains the same after changing page size
        // (since changing page size shouldn't affect the calculated total)
        await waitFor(() => {
            const newTotalCell = screen.getByText("Total")
                .closest("tr")
                .querySelector("td:nth-child(2)");
            expect(newTotalCell.textContent).toBe(initialTotal);
        });
    });

    test("maintains correct total when switching between pages", async () => {
        render(<ClientTransactions transactions={transactions} />);
        
        // Wait for initial render
        await waitFor(() => {
            expect(screen.getByText("Total")).toBeInTheDocument();
        });
        
        // Get the initial total
        const initialTotalCell = screen.getByText("Total")
            .closest("tr")
            .querySelector("td:nth-child(2)");
        const initialTotal = initialTotalCell.textContent;
        
        // Navigate to page 2
        fireEvent.click(screen.getByText("2"));
        
        // Verify total remains the same after changing page
        // (since changing page shouldn't affect the calculated total)
        await waitFor(() => {
            const newTotalCell = screen.getByText("Total")
                .closest("tr")
                .querySelector("td:nth-child(2)");
            expect(newTotalCell.textContent).toBe(initialTotal);
        });
    });
});