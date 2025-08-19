
import React, { useState, useEffect, useCallback } from 'react';
import { SignalData, ParsedSignal, CalculationResult } from './types';
import { parseSignalWithAI } from './services/geminiService';
import SignalForm from './components/SignalForm';
import SignalList from './components/SignalList';
import Header from './components/Header';
import Summary from './components/Summary';
import { LoadingIcon, ErrorIcon } from './components/Icons';

// Main calculation logic
const calculateProfitLoss = (parsedSignal: ParsedSignal, accountSize: number, selectedLeverage: number): CalculationResult | { error: string } => {
    const { coin, positionType, entryMin, entryMax, leverage, targets, stopLoss } = parsedSignal;

    if (!coin || entryMin === null || entryMax === null || leverage === null || stopLoss === null || !targets || targets.length === 0 || !positionType) {
        return { error: "Parsed signal is incomplete. Please ensure all details are present in the signal text." };
    }

    const entryPrice = (entryMin + entryMax) / 2;
    const initialInvestment = accountSize;
    const positionSize = initialInvestment * selectedLeverage;
    const contractAmount = positionSize / entryPrice;

    const calculatePnL = (currentPrice: number) => {
        if (positionType === 'SHORT') {
            return (entryPrice - currentPrice) * contractAmount;
        }
        return (currentPrice - entryPrice) * contractAmount;
    };

    return {
        coin,
        entryPrice,
        leverage: selectedLeverage,
        signalLeverage: leverage,
        initialInvestment,
        positionSize,
        contractAmount,
        positionType,
        targets: targets.map((targetPrice) => ({
            price: targetPrice,
            pnl: calculatePnL(targetPrice)
        })),
        stopLoss: {
            price: stopLoss,
            pnl: calculatePnL(stopLoss)
        }
    };
};

const App: React.FC = () => {
    const [currentSignalText, setCurrentSignalText] = useState(`📍Coin : #HIFI/USDT\n\n🔴 SHORT \n\n👉 Entry: 0.1363 - 0.1399\n\n🌐 Leverage: 20x\n\n🎯 Target 1: 0.1350\n🎯 Target 2: 0.1337\n🎯 Target 3: 0.1324\n🎯 Target 4: 0.1311\n🎯 Target 5: 0.1297\n🎯 Target 6: 0.1284\n\n❌ StopLoss: 0.1460`);
    const [accountSize, setAccountSize] = useState<number | ''>(100);
    const [selectedLeverage, setSelectedLeverage] = useState<number | ''>(20);
    const [signals, setSignals] = useState<SignalData[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalProfitLoss, setTotalProfitLoss] = useState(0);

    const addSignal = useCallback(async () => {
        if (!currentSignalText.trim()) {
            setError('Please paste a signal to add.');
            return;
        }
        if (Number(accountSize) <= 0 || Number(selectedLeverage) <= 0) {
            setError('Account size and leverage must be greater than zero.');
            return;
        }

        setLoading(true);
        setError('');

        const parsedSignal = await parseSignalWithAI(currentSignalText);

        if (parsedSignal.error) {
            setError(parsedSignal.error);
        } else {
            const calculationResults = calculateProfitLoss(parsedSignal, Number(accountSize), Number(selectedLeverage));
            if ('error' in calculationResults) {
                setError(calculationResults.error);
            } else {
                let initialHitPriceType: 'TP' | 'SL' = 'TP';
                let initialHitPriceIndex = 0;
                let initialHitPnl = calculationResults.targets.length > 0 ? calculationResults.targets[0].pnl : 0;

                setSignals(prevSignals => [
                    {
                        id: Date.now(),
                        signalText: currentSignalText,
                        accountSize: Number(accountSize),
                        selectedLeverage: Number(selectedLeverage),
                        parsedSignal,
                        calculationResults,
                        hitPriceType: initialHitPriceType,
                        hitPriceIndex: initialHitPriceIndex,
                        hitPnl: initialHitPnl,
                    },
                    ...prevSignals,
                ]);
                setCurrentSignalText('');
            }
        }
        setLoading(false);
    }, [currentSignalText, accountSize, selectedLeverage]);

    useEffect(() => {
        const total = signals.reduce((sum, signal) => sum + signal.hitPnl, 0);
        setTotalProfitLoss(total);
    }, [signals]);

    const handleHitPriceChange = useCallback((id: number, type: 'TP' | 'SL', index: number | null = null) => {
        setSignals(prevSignals => prevSignals.map(signal => {
            if (signal.id === id) {
                let hitPnl = 0;
                if (type === 'TP' && index !== null && signal.calculationResults.targets[index]) {
                    hitPnl = signal.calculationResults.targets[index].pnl;
                } else if (type === 'SL') {
                    hitPnl = signal.calculationResults.stopLoss.pnl;
                }
                return { ...signal, hitPriceType: type, hitPriceIndex: index, hitPnl };
            }
            return signal;
        }));
    }, []);

    const removeSignal = useCallback((id: number) => {
        setSignals(prevSignals => prevSignals.filter(signal => signal.id !== id));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <Header />
                <main>
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200/80 mb-8">
                        <SignalForm
                            accountSize={accountSize}
                            setAccountSize={setAccountSize}
                            selectedLeverage={selectedLeverage}
                            setSelectedLeverage={setSelectedLeverage}
                            currentSignalText={currentSignalText}
                            setCurrentSignalText={setCurrentSignalText}
                            addSignal={addSignal}
                            loading={loading}
                        />
                        {loading && (
                            <div className="flex items-center justify-center bg-blue-50/50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mt-6" role="status">
                                <LoadingIcon />
                                <span className="ml-2 font-medium">Parsing signal with AI... Please wait.</span>
                            </div>
                        )}
                        {error && !loading && (
                            <div className="flex items-center bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg mt-6" role="alert">
                                <ErrorIcon />
                                <div className="ml-3">
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline ml-1">{error}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {signals.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200/80">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Active Signals</h2>
                            <Summary totalProfitLoss={totalProfitLoss} />
                            <SignalList signals={signals} onHitPriceChange={handleHitPriceChange} onRemoveSignal={removeSignal} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
