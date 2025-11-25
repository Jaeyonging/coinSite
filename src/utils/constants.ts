
export const CHART_TIME_UNITS = {
  '1분': { unit: 'minutes/1', count: 100 },
  '5분': { unit: 'minutes/5', count: 100 },
  '15분': { unit: 'minutes/15', count: 100 },
  '30분': { unit: 'minutes/30', count: 100 },
  '1시간': { unit: 'minutes/60', count: 100 },
  '1일': { unit: 'days', count: 100 },
  '15일': { unit: 'days', count: 15 },
  '30일': { unit: 'days', count: 30 },
} as const;

export const COLORS = {
  RISE: '#00c896',
  FALL: '#ff4757',
  NEUTRAL: '#666',
} as const;

export const ANIMATION_DURATION = {
  PRICE_CHANGE: 500,
  TRANSITION: 150,
} as const;

export const CHART_CONFIG = {
  MIN_WIDTH: 900,
  HEIGHT: 450,
  MOBILE_HEIGHT: 300,
  TABLET_HEIGHT: 350,
  CANDLE_WIDTH_RATIO: 0.8,
  PADDING: {
    top: 20,
    right: 40,
    bottom: 40,
    left: 60,
  },
  MOBILE_PADDING: {
    top: 15,
    right: 20,
    bottom: 30,
    left: 35,
  },
} as const;
