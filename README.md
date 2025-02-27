# Banking Transactions Dashboard

A dashboard running on localhost for visualizing banking transactions from a family account.

## Getting Started

1. Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_AUTH_PASSWORD=your_password_here
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Security Note

The application uses a simple password protection mechanism. In a production environment, you should:
- Use proper server-side authentication
- Implement secure session management
- Store passwords using cryptographic hashing

## System

Style: concise answers, brevity is important
Project: a dashboard running on localhost for visualizing banking transactions from my family account.
Data: transactions available from one or multiple csv files. The files are not included in the repo.



## Code style:

- write simple concise code.
- development environment not optimised for production.
- no need for error handling.

## Project:

- project is based on React with Next.js and Tailwind, using App router
- not using typescript

## How I work:

- on Mac with Vscode with limited extensions
- with command lines in the terminal

## Files to check out

* components/ClientTransactions.jsx
* app/src/transactions/pages.jsx
* tailwind.config.js
* package.json
* jsconfig.json

