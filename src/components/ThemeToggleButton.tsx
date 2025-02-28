// components/ThemeToggleButton.tsx
'use client';

import React, { useState, useEffect, FC, MouseEvent } from 'react';

const ThemeToggleButton: FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleTheme = (e: MouseEvent<HTMLButtonElement>): void => {
        setDarkMode(!darkMode);
    };

    return (
        <button
            onClick={toggleTheme}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
};

export default ThemeToggleButton;