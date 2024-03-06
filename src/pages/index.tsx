import React from 'react';
import { useRouter } from 'next/router';

const IndexPage: React.FC = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to the App</h1>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mb-4"
        onClick={() => navigateTo('/login')} // Assuming you have a login page
      >
        Login
      </button>
      <button
        className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        onClick={() => navigateTo('/createAccount')}
      >
        Create Account
      </button>
    </div>
  );
};

export default IndexPage;