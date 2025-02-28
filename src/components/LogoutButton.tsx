'use client';

import React, { FC, MouseEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutButton: FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    logout();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;