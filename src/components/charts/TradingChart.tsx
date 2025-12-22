import { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  LineData, 
  Time,
  CandlestickSeries,
  LineSeries,
} from 'lightweight-charts';
import { CandleWithIndicators, calculateIndicators, calculateLevels, DEFAULT_STRATEGY_CONFIG } from './ChartIndicators';
import { Position } from '@/services/botApi';
import { cn } from '@/lib/utils';

interface TradingChartProps {
  candles: CandleWithIndicators[];
  position?: Position | null;
  className?: string;
  showIndicators?: boolean;
}

export function TradingChart({ candles, position, className, showIndicators = true }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const emaSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const magneticSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'hsl(215 20% 55%)',
      },
      grid: {
        vertLines: { color: 'hsl(217 33% 12%)' },
        horzLines: { color: 'hsl(217 33% 12%)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'hsl(142 76% 45% / 0.3)',
          labelBackgroundColor: 'hsl(142 76% 45%)',
        },
        horzLine: {
          color: 'hsl(142 76% 45% / 0.3)',
          labelBackgroundColor: 'hsl(142 76% 45%)',
        },
      },
      rightPriceScale: {
        borderColor: 'hsl(217 33% 17%)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: 'hsl(217 33% 17%)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Candlestick series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: 'hsl(142 76% 45%)',
      downColor: 'hsl(0 84% 60%)',
      borderUpColor: 'hsl(142 76% 45%)',
      borderDownColor: 'hsl(0 84% 60%)',
      wickUpColor: 'hsl(142 76% 45%)',
      wickDownColor: 'hsl(0 84% 60%)',
    });

    // EMA Escadinha line
    const emaSeries = chart.addSeries(LineSeries, {
      color: 'hsl(142 76% 55%)',
      lineWidth: 2,
      title: 'EMA Escadinha',
    });

    // Magnetic Line
    const magneticSeries = chart.addSeries(LineSeries, {
      color: 'hsl(280 70% 50%)',
      lineWidth: 2,
      lineStyle: 2, // Dashed
      title: 'Linha Magnética',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    emaSeriesRef.current = emaSeries;
    magneticSeriesRef.current = magneticSeries;

    setIsReady(true);

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!isReady || !chartRef.current) return;
    if (!candleSeriesRef.current || !emaSeriesRef.current || !magneticSeriesRef.current) return;
    if (candles.length === 0) return;

    // Calculate indicators
    const dataWithIndicators = calculateIndicators(candles);

    // Format candlestick data
    const candleData: CandlestickData<Time>[] = dataWithIndicators.map(c => ({
      time: (new Date(c.time).getTime() / 1000) as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    // Format EMA data
    const emaData: LineData<Time>[] = dataWithIndicators
      .filter(c => c.emaSmooth !== undefined)
      .map(c => ({
        time: (new Date(c.time).getTime() / 1000) as Time,
        value: c.emaSmooth!,
      }));

    // Format Magnetic Line data
    const magneticData: LineData<Time>[] = dataWithIndicators
      .filter(c => c.magneticLine !== undefined)
      .map(c => ({
        time: (new Date(c.time).getTime() / 1000) as Time,
        value: c.magneticLine!,
      }));

    candleSeriesRef.current.setData(candleData);
    
    if (showIndicators) {
      emaSeriesRef.current.setData(emaData);
      magneticSeriesRef.current.setData(magneticData);
    } else {
      emaSeriesRef.current.setData([]);
      magneticSeriesRef.current.setData([]);
    }

    // Signal markers are visualized via the indicator crossovers
    // In lightweight-charts v5, markers are handled differently

    // Add price lines for position levels
    if (position && candleSeriesRef.current) {
      const levels = calculateLevels(position.entry_price, position.side);
      
      // Remove existing price lines (by setting new ones)
      const priceLines = [
        { price: position.entry_price, color: 'hsl(217 91% 60%)', title: 'Entry', lineStyle: 0 },
        { price: levels.tp1, color: 'hsl(142 76% 45%)', title: 'TP1 (1.1%)', lineStyle: 2 },
        { price: levels.tp2, color: 'hsl(142 76% 50%)', title: 'TP2 (2.3%)', lineStyle: 2 },
        { price: levels.tp3, color: 'hsl(142 76% 55%)', title: 'TP3 (4.5%)', lineStyle: 2 },
        { price: levels.tp4, color: 'hsl(142 76% 60%)', title: 'TP4 (7.5%)', lineStyle: 2 },
        { price: levels.sl, color: 'hsl(0 84% 60%)', title: `SL (${DEFAULT_STRATEGY_CONFIG.slPercent}%)`, lineStyle: 0 },
      ];

      priceLines.forEach(line => {
        candleSeriesRef.current?.createPriceLine({
          price: line.price,
          color: line.color,
          lineWidth: 1,
          lineStyle: line.lineStyle,
          axisLabelVisible: true,
          title: line.title,
        });
      });
    }

    // Fit content
    chartRef.current.timeScale().fitContent();

  }, [candles, position, isReady, showIndicators]);

  return (
    <div 
      ref={containerRef} 
      className={cn("w-full h-full min-h-[400px]", className)}
    />
  );
}
