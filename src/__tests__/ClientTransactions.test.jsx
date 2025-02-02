// src/__tests__/ClientTransactions.test.jsx

import { render, screen, fireEvent, within } from "@testing-library/react";
import ClientTransactions from "../components/ClientTransactions";
import mockTransactions from "../test-utils/mockTransactions";

describe("ClientTransactions - Filtering Feature", () => {
    test("renders all transactions initially", () => {
        render(<ClientTransactions transactions={mockTransactions} />);

        // Get the table body to scope the search
        const tableBody = screen.getByRole("table").querySelector("tbody");

        // Expect all transactions to be visible
        mockTransactions.forEach(transaction => {
            expect(within(tableBody).getAllByText(transaction.Payee)[0]).toBeInTheDocument();
        });
    });

    test("filters transactions based on Payee input", () => {
        render(<ClientTransactions transactions={mockTransactions} />);

        // Get input field and filter for "Amazon"
        const input = screen.getByPlaceholderText("Filter by Payee");
        fireEvent.change(input, { target: { value: "Amazon" } });

        // Get the table body to scope the search
        const tableBody = screen.getByRole("table").querySelector("tbody");

        // Only Amazon transactions should be displayed
        expect(within(tableBody).getAllByText("Amazon")[0]).toBeInTheDocument();
        expect(within(tableBody).queryByText("Netflix")).not.toBeInTheDocument();
        expect(within(tableBody).queryByText("Spotify")).not.toBeInTheDocument();
    });

    test("clearing filter restores all transactions", () => {
        render(<ClientTransactions transactions={mockTransactions} />);

        const input = screen.getByPlaceholderText("Filter by Payee");
        // Get the table body to scope the search
        const tableBody = screen.getByRole("table").querySelector("tbody");

        // Apply filter
        fireEvent.change(input, { target: { value: "Amazon" } });
        expect(within(tableBody).getAllByText("Amazon")[0]).toBeInTheDocument();
        expect(within(tableBody).queryByText("Netflix")).not.toBeInTheDocument();

        // Clear filter
        fireEvent.change(input, { target: { value: "" } });

        // Expect all transactions to be restored
        mockTransactions.forEach(transaction => {
            expect(within(tableBody).getAllByText(transaction.Payee)[0]).toBeInTheDocument();
        });
    });
});
