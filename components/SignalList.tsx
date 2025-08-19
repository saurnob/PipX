
import React from 'react';
import { SignalData } from '../types';
import SignalCard from './SignalCard';

interface SignalListProps {
    signals: SignalData[];
    onHitPriceChange: (id: number, type: 'TP' | 'SL', index: number | null) => void;
    onRemoveSignal: (id: number) => void;
}

const SignalList: React.FC<SignalListProps> = ({ signals, onHitPriceChange, onRemoveSignal }) => {
    return (
        <div className="space-y-4">
            {signals.map((signal) => (
                <SignalCard
                    key={signal.id}
                    signal={signal}
                    onHitPriceChange={onHitPriceChange}
                    onRemoveSignal={onRemoveSignal}
                />
            ))}
        </div>
    );
};

export default SignalList;
