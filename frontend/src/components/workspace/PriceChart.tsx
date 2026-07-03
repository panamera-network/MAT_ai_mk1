// frontend/src/components/workspace/PriceChart.tsx
// Candlestick chart (lightweight-charts v5) with SNR price lines and
// order-block / FVG boxes overlaid via ZonesPrimitive.

import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  ColorType,
  LineStyle,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'
import { ZonesPrimitive, type ZoneBox } from './zonesPrimitive'
import type { EngineCandle, Fvg, OrderBlock, SnrLevel } from '@services/engineService'

interface PriceChartProps {
  candles: EngineCandle[]
  snrLevels: SnrLevel[]
  orderBlocks: OrderBlock[]
  fvgs: Fvg[]
}

const UP_COLOR = '#26a69a'
const DOWN_COLOR = '#ef5350'

export function PriceChart({ candles, snrLevels, orderBlocks, fvgs }: PriceChartProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const zonesRef = useRef<ZonesPrimitive | null>(null)
  const priceLinesRef = useRef<IPriceLine[]>([])

  // One-time chart setup + resize handling
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = createChart(el, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#b4b4b5',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.05)' },
        horzLines: { color: 'rgba(255,255,255,0.05)' },
      },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.15)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.15)', timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: UP_COLOR,
      downColor: DOWN_COLOR,
      borderUpColor: UP_COLOR,
      borderDownColor: DOWN_COLOR,
      wickUpColor: UP_COLOR,
      wickDownColor: DOWN_COLOR,
    })

    const zones = new ZonesPrimitive()
    series.attachPrimitive(zones as never)

    chartRef.current = chart
    seriesRef.current = series
    zonesRef.current = zones

    return () => {
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      zonesRef.current = null
      priceLinesRef.current = []
    }
  }, [])

  // Candle data
  useEffect(() => {
    const series = seriesRef.current
    if (!series) return
    series.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    )
    chartRef.current?.timeScale().fitContent()
  }, [candles])

  // SNR horizontal lines
  useEffect(() => {
    const series = seriesRef.current
    if (!series) return
    for (const line of priceLinesRef.current) series.removePriceLine(line)
    priceLinesRef.current = snrLevels.map((lvl) =>
      series.createPriceLine({
        price: lvl.level,
        color: lvl.type === 'Support' ? UP_COLOR : DOWN_COLOR,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: lvl.label || lvl.type,
      }),
    )
  }, [snrLevels])

  // Order-block + FVG boxes
  useEffect(() => {
    const boxes: ZoneBox[] = []
    for (const ob of orderBlocks) {
      const bullish = ob.type === 'Bullish'
      boxes.push({
        from: Number(ob.timestamp),
        top: ob.high,
        bottom: ob.low,
        fill: bullish ? 'rgba(38, 166, 154, 0.14)' : 'rgba(239, 83, 80, 0.14)',
        border: bullish ? 'rgba(38, 166, 154, 0.55)' : 'rgba(239, 83, 80, 0.55)',
      })
    }
    for (const gap of fvgs) {
      const bullish = gap.type === 'Bullish'
      boxes.push({
        from: Number(gap.timestamp),
        top: gap.top,
        bottom: gap.bottom,
        fill: bullish ? 'rgba(124, 170, 248, 0.16)' : 'rgba(197, 163, 255, 0.16)',
      })
    }
    zonesRef.current?.setZones(boxes)
  }, [orderBlocks, fvgs])

  return <div ref={containerRef} className="ws-chart" />
}
