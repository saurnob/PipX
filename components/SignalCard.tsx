
import React from 'react';
import { SignalData } from '../types';
import { LongIcon, ShortIcon, TrashIcon } from './Icons';

interface SignalCardProps {
    signal: SignalData;
    onHitPriceChange: (id: number, type: 'TP' | 'SL', index: number | null) => void;
    onRemoveSignal: (id: number) => void;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, onHitPriceChange, onRemoveSignal }) => {
    const { parsedSignal, calculationResults, hitPnl } = signal;
    const isLong = parsedSignal.positionType === 'LONG';
    const pnlColor = hitPnl >= 0 ? 'text-green-600' : 'text-red-500';
    const positionBgColor = isLong ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transform transition-all hover:shadow-md hover:-translate-y-1">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-bold text-gray-900">{parsedSignal.coin}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center ${positionBgColor}`}>
                                {isLong ? <LongIcon /> : <ShortIcon />}
                                <span className="ml-1">{parsedSignal.positionType}</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Entry: {parsedSignal.entryMin?.toFixed(4)} - {parsedSignal.entryMax?.toFixed(4)}
                        </p>
                    </div>
                    <button
                        onClick={() => onRemoveSignal(signal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove Signal"
                    >
                        <TrashIcon />
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Desired Leverage</p>
                        <p className="font-semibold text-gray-800">{signal.selectedLeverage}x</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Signal Leverage</p>
                        <p className="font-semibold text-gray-800">{parsedSignal.leverage}x</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Position Size</p>
                        <p className="font-semibold text-gray-800">${calculationResults.positionSize.toFixed(2)}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">Account Size</p>
                        <p className="font-semibold text-gray-800">${signal.accountSize.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <div>
                    <label htmlFor={`hit-price-${signal.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Select Outcome
                    </label>
                    <select
                        id={`hit-price-${signal.id}`}
                        value={signal.hitPriceType === 'SL' ? 'SL' : `TP-${signal.hitPriceIndex}`}
                        onChange={(e) => {
                            const [type, index] = e.target.value.split('-');
                            onHitPriceChange(signal.id, type as 'TP' | 'SL', index ? parseInt(index, 10) : null);
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    >
                        {calculationResults.targets.map((tp, idx) => (
                            <option key={`tp-${idx}`} value={`TP-${idx}`}>
                                Target {idx + 1} ({tp.price.toFixed(4)})
                            </option>
                        ))}
                        <option value="SL">
                            Stop Loss ({calculationResults.stopLoss.price.toFixed(4)})
                        </option>
                    </select>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-sm font-medium text-gray-700">Realized P&L</p>
                    <p className={`text-2xl font-bold ${pnlColor}`}>
                        {hitPnl.toFixed(2)} USDT
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignalCard;
