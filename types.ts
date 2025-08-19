
export interface ParsedSignal {
  coin: string | null;
  positionType: 'LONG' | 'SHORT' | null;
  entryMin: number | null;
  entryMax: number | null;
  leverage: number | null;
  targets: number[] | null;
  stopLoss: number | null;
  error?: string;
}

export interface PnLResult {
  price: number;
  pnl: number;
}

export interface CalculationResult {
  coin: string;
  entryPrice: number;
  leverage: number;
  signalLeverage: number;
  initialInvestment: number;
  positionSize: number;
  contractAmount: number;
  positionType: 'LONG' | 'SHORT';
  targets: PnLResult[];
  stopLoss: PnLResult;
  error?: string;
}

export interface SignalData {
  id: number;
  signalText: string;
  accountSize: number;
  selectedLeverage: number;
  parsedSignal: ParsedSignal;
  calculationResults: CalculationResult;
  hitPriceType: 'TP' | 'SL';
  hitPriceIndex: number | null;
  hitPnl: number;
}
