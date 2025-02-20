import * as PIXI from 'pixi.js'

const drawEye = (graphics, { x, y, r, strokeColor, irisColor, pupilColor }) => {
  // Iris
  graphics.lineStyle(0.5, strokeColor)
  graphics.beginFill(irisColor)
  graphics.drawCircle(x, y, r / 2)
  graphics.endFill()

  // Pupil
  graphics.beginFill(pupilColor)
  graphics.drawCircle(x, y + r * 0.05, r / 3)
  graphics.endFill()

  // Shine
  graphics.beginFill(0xffffff) // White shine
  graphics.drawCircle(x, y - r * 0.05, r / 8)
  graphics.endFill()
}

export const drawRobot = (app, { x, y, r, theta, color }) => {
  const { primary, secondary } = color
  const d = 2 * r
  const a = r * 1.6

  const p1 = {
    x: x + a * Math.cos(theta + Math.PI / 6),
    y: y + a * Math.sin(theta + Math.PI / 6)
  }
  const p2 = {
    x: x + a * Math.cos(theta + Math.PI / 6 - Math.PI / 3),
    y: y + a * Math.sin(theta + Math.PI / 6 - Math.PI / 3)
  }

  // Create a container to handle transformations
  const container = new PIXI.Container()
  container.position.set(x, y)
  container.rotation = theta - Math.PI / 2

  // Graphics for drawing
  const graphics = new PIXI.Graphics()

  // Head (Ellipse shape)
  graphics.beginFill(primary)
  graphics.drawEllipse(0, -d * 0.08, d / 2, (d * 0.6) / 2)
  graphics.endFill()

  // Wing-like features
  const lw = d * 0.8
  const lh = d * 0.35
  const lx = -r * 0.4
  const rx = r * 0.4
  const ey = d * 0.18

  // Left wing
  graphics.beginFill(primary)
  graphics.drawEllipse(lx, ey, lw / 2, lh / 2)
  graphics.endFill()

  // Right wing
  graphics.beginFill(primary)
  graphics.drawEllipse(rx, ey, lw / 2, lh / 2)
  graphics.endFill()

  // Eyes
  drawEye(graphics, {
    x: -r * 0.7,
    y: r * 0.2,
    r: r / 1.5,
    strokeColor: primary,
    irisColor: 0xf39200,
    pupilColor: 0x3c3c3b
  })

  drawEye(graphics, {
    x: r * 0.7,
    y: r * 0.2,
    r: r / 1.5,
    strokeColor: primary,
    irisColor: 0xf39200,
    pupilColor: 0x3c3c3b
  })

  // Add to container
  container.addChild(graphics)
  app.stage.addChild(container)
}

export default drawRobot
