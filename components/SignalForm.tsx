
import React from 'react';
import { LoadingIcon } from './Icons';

interface SignalFormProps {
    accountSize: number | '';
    setAccountSize: (value: number | '') => void;
    selectedLeverage: number | '';
    setSelectedLeverage: (value: number | '') => void;
    currentSignalText: string;
    setCurrentSignalText: (value: string) => void;
    addSignal: () => void;
    loading: boolean;
}

const SignalForm: React.FC<SignalFormProps> = ({
    accountSize,
    setAccountSize,
    selectedLeverage,
    setSelectedLeverage,
    currentSignalText,
    setCurrentSignalText,
    addSignal,
    loading
}) => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="accountSize" className="block text-sm font-medium text-gray-700 mb-2">
                        Account Size (USDT)
                    </label>
                    <input
                        type="number"
                        id="accountSize"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        value={accountSize}
                        onChange={(e) => setAccountSize(e.target.value === '' ? '' : Number(e.target.value))}
                        min="0"
                        step="any"
                        placeholder="e.g., 100"
                    />
                </div>
                <div>
                    <label htmlFor="leverage" className="block text-sm font-medium text-gray-700 mb-2">
                        Desired Leverage (x)
                    </label>
                    <input
                        type="number"
                        id="leverage"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        value={selectedLeverage}
                        onChange={(e) => setSelectedLeverage(e.target.value === '' ? '' : Number(e.target.value))}
                        min="1"
                        step="1"
                        placeholder="e.g., 20"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="currentSignalText" className="block text-sm font-medium text-gray-700 mb-2">
                    Paste New Crypto Signal Here
                </label>
                <textarea
                    id="currentSignalText"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    rows={8}
                    value={currentSignalText}
                    onChange={(e) => setCurrentSignalText(e.target.value)}
                    placeholder="e.g., 📍Coin : #BTC/USDT\nLONG\n👉 Entry: 30000 - 30500\n🌐 Leverage: 10x\n🎯 Target 1: 31000\n❌ StopLoss: 29500"
                ></textarea>
            </div>
            <button
                onClick={addSignal}
                disabled={loading}
                className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? <><LoadingIcon /> Adding Signal...</> : 'Add Signal'}
            </button>
        </div>
    );
};

export default SignalForm;
