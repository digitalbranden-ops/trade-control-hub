// Strategy Indicators - EMA Escadinha + Linha Magnética (Modelo C)
// Based on Pine Script: DQD Crypto – EMA Escadinha + Magnetico

export interface CandleWithIndicators {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  emaSmooth?: number;
  magneticLine?: number;
  signal?: 'LONG' | 'SHORT' | null;
}

export interface StrategyConfig {
  emaLen: number;        // Periodo da EMA (default: 9)
  smoothLen: number;     // Suavizacao EMA (default: 46)
  stdLen: number;        // Periodo Desvio (default: 80)
  stdMult: number;       // Multiplicador Desvio (default: 0.8)
  forceMag: number;      // Intensidade Magnetica (default: 155)
  tp1Percent: number;    // TP1 % (default: 1.1)
  tp2Percent: number;    // TP2 % (default: 2.3)
  tp3Percent: number;    // TP3 % (default: 4.5)
  tp4Percent: number;    // TP4 % (default: 7.5)
  slPercent: number;     // Stop Loss % (default: 1.4)
  trailPercent: number;  // Trailing Stop % (default: 3.0)
}

export const DEFAULT_STRATEGY_CONFIG: StrategyConfig = {
  emaLen: 9,
  smoothLen: 46,
  stdLen: 80,
  stdMult: 0.8,
  forceMag: 155,
  tp1Percent: 1.1,
  tp2Percent: 2.3,
  tp3Percent: 4.5,
  tp4Percent: 7.5,
  slPercent: 1.4,
  trailPercent: 3.0,
};

// Calculate EMA (Exponential Moving Average)
function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const ema: number[] = [];
  
  if (data.length === 0) return ema;
  
  ema[0] = data[0];
  
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * k + ema[i - 1] * (1 - k);
  }
  
  return ema;
}

// Calculate Standard Deviation
function calculateStdDev(data: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result[i] = 0;
      continue;
    }
    
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const squaredDiffs = slice.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / slice.length;
    result[i] = Math.sqrt(variance);
  }
  
  return result;
}

// Calculate strategy indicators
export function calculateIndicators(
  candles: { time: string; open: number; high: number; low: number; close: number; volume: number }[],
  config: StrategyConfig = DEFAULT_STRATEGY_CONFIG
): CandleWithIndicators[] {
  if (candles.length === 0) return [];

  const closes = candles.map(c => c.close);
  
  // EMA Base
  const emaBase = calculateEMA(closes, config.emaLen);
  
  // EMA Smooth (EMA Escadinha)
  const emaSmooth = calculateEMA(emaBase, config.smoothLen);
  
  // Standard Deviation
  const stdDev = calculateStdDev(closes, config.stdLen);
  
  // Calculate Magnetic Line
  const magneticLines: number[] = [];
  let prevMagneticLine = closes[0];
  
  for (let i = 0; i < candles.length; i++) {
    const isUp = emaSmooth[i] > emaSmooth[Math.max(0, i - 1)];
    const deviation = stdDev[i] * config.stdMult;
    
    // invLineRaw calculation (simplified version)
    const invLineRaw = isUp 
      ? emaSmooth[i] - deviation 
      : emaSmooth[i] + deviation;
    
    // Apply magnetic force
    const invLine = isUp 
      ? invLineRaw - config.forceMag 
      : invLineRaw + config.forceMag;
    
    magneticLines[i] = invLine;
    prevMagneticLine = invLine;
  }
  
  // Generate signals
  const signals: (null | 'LONG' | 'SHORT')[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      signals[i] = null;
      continue;
    }
    
    const prevEma = emaSmooth[i - 1];
    const currEma = emaSmooth[i];
    const prevMag = magneticLines[i - 1];
    const currMag = magneticLines[i];
    
    // LONG: EMA crosses above Magnetic Line
    if (prevEma <= prevMag && currEma > currMag) {
      signals[i] = 'LONG';
    }
    // SHORT: EMA crosses below Magnetic Line
    else if (prevEma >= prevMag && currEma < currMag) {
      signals[i] = 'SHORT';
    } else {
      signals[i] = null;
    }
  }
  
  // Combine everything
  return candles.map((candle, i) => ({
    ...candle,
    emaSmooth: emaSmooth[i],
    magneticLine: magneticLines[i],
    signal: signals[i],
  }));
}

// Calculate TP and SL levels for a position
export function calculateLevels(
  entryPrice: number,
  side: 'LONG' | 'SHORT',
  config: StrategyConfig = DEFAULT_STRATEGY_CONFIG
) {
  const multiplier = side === 'LONG' ? 1 : -1;
  
  return {
    tp1: entryPrice * (1 + multiplier * config.tp1Percent / 100),
    tp2: entryPrice * (1 + multiplier * config.tp2Percent / 100),
    tp3: entryPrice * (1 + multiplier * config.tp3Percent / 100),
    tp4: entryPrice * (1 + multiplier * config.tp4Percent / 100),
    sl: entryPrice * (1 - multiplier * config.slPercent / 100),
    trailing: entryPrice * (1 + multiplier * config.trailPercent / 100),
  };
}
