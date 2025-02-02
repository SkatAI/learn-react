// components/ThemeToggleButton.jsx
'use client';

import React, { useState, useEffect } from 'react';

function ThemeToggleButton() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <button
            onClick= {() => setDarkMode(!darkMode)
}
className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
    { darkMode? 'Light Mode': 'Dark Mode' }
    </button>
    );
}

export default ThemeToggleButton;