// frontend/src/components/workspace/zonesPrimitive.ts
// Series primitive for lightweight-charts v5 that paints horizontal boxes
// (order blocks, FVGs) from a start time to the right edge of the pane.

import type { IChartApi, ISeriesApi, SeriesType, Time } from 'lightweight-charts'

export interface ZoneBox {
  /** epoch seconds of the zone's origin candle */
  from: number
  top: number
  bottom: number
  fill: string
  border?: string
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
  fill: string
  border?: string
}

export class ZonesPrimitive {
  private _chart: IChartApi | null = null
  private _series: ISeriesApi<SeriesType> | null = null
  private _requestUpdate: (() => void) | null = null
  private _zones: ZoneBox[] = []
  private _rects: Rect[] = []

  private _paneView = {
    renderer: () => ({
      draw: (target: any) => {
        const rects = this._rects
        if (!rects.length) return
        target.useMediaCoordinateSpace((scope: any) => {
          const ctx: CanvasRenderingContext2D = scope.context
          for (const r of rects) {
            ctx.fillStyle = r.fill
            ctx.fillRect(r.x, r.y, r.w, r.h)
            if (r.border) {
              ctx.strokeStyle = r.border
              ctx.lineWidth = 1
              ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1)
            }
          }
        })
      },
    }),
  }

  attached(param: { chart: IChartApi; series: ISeriesApi<SeriesType>; requestUpdate: () => void }): void {
    this._chart = param.chart
    this._series = param.series
    this._requestUpdate = param.requestUpdate
  }

  detached(): void {
    this._chart = null
    this._series = null
    this._requestUpdate = null
  }

  paneViews() {
    return [this._paneView]
  }

  updateAllViews(): void {
    this._computeRects()
  }

  setZones(zones: ZoneBox[]): void {
    this._zones = zones
    this._requestUpdate?.()
  }

  private _computeRects(): void {
    this._rects = []
    if (!this._chart || !this._series || !this._zones.length) return

    const timeScale = this._chart.timeScale()
    const paneWidth = timeScale.width()
    if (!paneWidth) return

    const visible = timeScale.getVisibleRange()

    for (const z of this._zones) {
      const yTop = this._series.priceToCoordinate(Math.max(z.top, z.bottom))
      const yBottom = this._series.priceToCoordinate(Math.min(z.top, z.bottom))
      if (yTop === null || yBottom === null) continue

      let x = timeScale.timeToCoordinate(z.from as Time)
      if (x === null) {
        // Origin candle is outside the loaded/visible axis. If it's older
        // than the visible window, pin the box to the left edge; otherwise skip.
        if (visible && z.from <= (visible.from as number)) {
          x = 0 as never
        } else {
          continue
        }
      }

      const left = Math.max(0, x as number)
      this._rects.push({
        x: left,
        y: Math.min(yTop, yBottom),
        w: paneWidth - left,
        h: Math.abs(yBottom - yTop),
        fill: z.fill,
        border: z.border,
      })
    }
  }
}
