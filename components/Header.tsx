import React from 'react';
import { AILogo } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    PipX
                </h1>
                <span className="ml-3 bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1.5 rounded-full inline-flex items-center">
                    <AILogo />
                    AI Powered
                </span>
            </div>
            <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                Paste crypto signals, set your account size, and let AI calculate your potential profit & loss across multiple trades.
            </p>
        </header>
    );
};

export default Header;