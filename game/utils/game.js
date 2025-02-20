import { lighten } from 'color2k'

export const colors = [
  'rgb(209, 21, 0)',
  'rgb(155, 89, 182)',
  'rgb(142, 68, 173)',
  'rgb(41, 128, 185)',
  'rgb(52, 152, 219)',
  'rgb(23, 165, 137)',
  'rgb(19, 141, 117)',
  'rgb(34, 153, 84)',
  'rgb(40, 180, 99)',
  'rgb(212, 172, 13)',
  'rgb(214, 137, 16)',
  'rgb(202, 111, 30)',
  'rgb(186, 74, 0)'
]

// 'rgb(192, 57, 43)',
// 'rgb(231, 76, 60)',

export const getColors = (index) => {
  const primary = colors[index]
  const secondary = lighten(primary, 0.1)
  const support = lighten(secondary, 0.1)

  return { primary, secondary, support }
}

export const getAttackColors = (index) => {
  const secondary = colors[index]
  const primary = lighten(secondary, 0.1)
  const support = lighten(secondary, 0.1)

  return { primary, secondary, support }
}
