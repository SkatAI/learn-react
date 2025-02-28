// src/__tests__/ThemeToggleButton.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggleButton from '../components/ThemeToggleButton';

// Mock the document.documentElement
const documentElementClassListMock = {
  add: jest.fn(),
  remove: jest.fn(),
};

// Store the original classList
const originalClassList = document.documentElement.classList;

describe('ThemeToggleButton', () => {
  beforeAll(() => {
    // Replace document.documentElement.classList with our mock
    Object.defineProperty(document.documentElement, 'classList', {
      value: documentElementClassListMock,
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original classList
    Object.defineProperty(document.documentElement, 'classList', {
      value: originalClassList,
      writable: true,
    });
  });

  beforeEach(() => {
    // Clear mock calls before each test
    documentElementClassListMock.add.mockClear();
    documentElementClassListMock.remove.mockClear();
  });

  test('renders with initial "Dark Mode" text', () => {
    render(<ThemeToggleButton />);
    
    // Initial state should be light mode
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Dark Mode');
    
    // Verify dark class was not added to documentElement
    expect(documentElementClassListMock.add).not.toHaveBeenCalled();
    expect(documentElementClassListMock.remove).toHaveBeenCalledWith('dark');
  });

  test('toggles to dark mode when clicked', () => {
    render(<ThemeToggleButton />);
    
    // Click the button to toggle to dark mode
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Button text should change
    expect(button).toHaveTextContent('Light Mode');
    
    // Verify dark class was added to documentElement
    expect(documentElementClassListMock.add).toHaveBeenCalledWith('dark');
  });

  test('toggles back to light mode when clicked again', () => {
    render(<ThemeToggleButton />);
    
    // First click - toggle to dark mode
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Reset mocks for clearer assertions
    documentElementClassListMock.add.mockClear();
    documentElementClassListMock.remove.mockClear();
    
    // Second click - toggle back to light mode
    fireEvent.click(button);
    
    // Button text should change back
    expect(button).toHaveTextContent('Dark Mode');
    
    // Verify dark class was removed
    expect(documentElementClassListMock.remove).toHaveBeenCalledWith('dark');
  });
  
  test('applies the correct button styling', () => {
    render(<ThemeToggleButton />);
    
    const button = screen.getByRole('button');
    
    // Check for Tailwind classes
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('hover:bg-blue-700');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('rounded');
  });
});