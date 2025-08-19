
import React from 'react';

interface SummaryProps {
    totalProfitLoss: number;
}

const Summary: React.FC<SummaryProps> = ({ totalProfitLoss }) => {
    const colorClass = totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600';
    const bgClass = totalProfitLoss >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

    return (
        <div className={`text-right text-xl font-bold text-gray-900 mb-6 p-4 border rounded-lg ${bgClass}`}>
            Total Profit/Loss: <span className={`text-2xl font-extrabold ${colorClass}`}>{totalProfitLoss.toFixed(2)} USDT</span>
        </div>
    );
};

export default Summary;
