export const lerp = (a, b, t) => t * (b - a) + a

// export const lerp = (start, end, time) => {
//   return start * (1 - time) + end * time
// }

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const clampDelta = (d, max) => clamp(d - Math.floor(d / max) * max, 0, max)

export const slerp = (a, b, t) => {
  const dt = clampDelta(b - a, Math.PI)
  return clerp(a, a + (dt > Math.PI / 2 ? dt - Math.PI : dt), t)
}

export const clerp = (a, b, t) => {
  const t2 = (1 - Math.cos(t * Math.PI)) / 2
  return a * (1 - t2) + b * t2
}

export const fixed = (a, x) => parseFloat(a.toFixed(x))

// export const lerp = (a, b, t) => a * (1 - t) + b * t

export const normalize = (value, min, max, minValue, maxValue) =>
  ((value - min) / (max - min)) * (maxValue - minValue) + minValue

export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min
