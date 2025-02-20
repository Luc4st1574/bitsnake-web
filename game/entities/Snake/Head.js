import * as PIXI from 'pixi.js'

const drawEye = (graphics, { x, y, r, strokeColor, fillColor, pupilColor, theta }) => {
  // Eye (white part)
  graphics.lineStyle(2, strokeColor)
  graphics.beginFill(fillColor)
  graphics.drawCircle(x, y, r / 2)
  graphics.endFill()

  // Pupil (black part)
  graphics.beginFill(pupilColor)
  graphics.drawCircle(x + Math.cos(theta), y + Math.sin(theta), r / 4)
  graphics.endFill()
}

const TwoEyeBranch = (app, { x, y, r, theta, color }) => {
  const { primary, secondary } = color
  const d = r * 1.6

  const p1 = {
    x: x + d * Math.cos(theta + Math.PI / 6),
    y: y + d * Math.sin(theta + Math.PI / 6)
  }
  const p2 = {
    x: x + d * Math.cos(theta + Math.PI / 6 - Math.PI / 3),
    y: y + d * Math.sin(theta + Math.PI / 6 - Math.PI / 3)
  }

  const container = new PIXI.Container()
  container.position.set(x, y)
  container.rotation = theta

  const graphics = new PIXI.Graphics()

  // Head
  graphics.beginFill(secondary)
  graphics.drawCircle(0, 0, r)
  graphics.endFill()

  // Eyes
  drawEye(graphics, { x: p1.x - x, y: p1.y - y, r, strokeColor: primary, fillColor: 0xf5f5f5, pupilColor: 0x000000, theta })
  drawEye(graphics, { x: p2.x - x, y: p2.y - y, r, strokeColor: primary, fillColor: 0xf5f5f5, pupilColor: 0x000000, theta })

  container.addChild(graphics)
  app.stage.addChild(container)
}

const TwoEye = (app, { x, y, r, theta, color }) => {
  const { primary } = color
  const d = r / 2

  const p1 = {
    x: x + d * Math.cos(theta - 20),
    y: y + d * Math.sin(theta - 20)
  }
  const p2 = {
    x: x + d * Math.cos(theta - 20 + 40),
    y: y + d * Math.sin(theta - 20 + 40)
  }

  const container = new PIXI.Container()
  container.position.set(x, y)
  container.rotation = theta

  const graphics = new PIXI.Graphics()

  // Head
  graphics.beginFill(primary)
  graphics.drawCircle(0, 0, r)
  graphics.endFill()

  // Eyes
  drawEye(graphics, { x: p1.x - x, y: p1.y - y, r, strokeColor: primary, fillColor: 0xf5f5f5, pupilColor: 0x000000, theta })
  drawEye(graphics, { x: p2.x - x, y: p2.y - y, r, strokeColor: primary, fillColor: 0xf5f5f5, pupilColor: 0x000000, theta })

  container.addChild(graphics)
  app.stage.addChild(container)
}

const OneEye = (app, { x, y, r, theta, color }) => {
  const { primary } = color
  const d1 = 2
  const d2 = 3

  const container = new PIXI.Container()
  container.position.set(x, y)
  container.rotation = theta

  const graphics = new PIXI.Graphics()

  // Head
  graphics.lineStyle(2, primary)
  graphics.beginFill(0xf5f5f5)
  graphics.drawCircle(0, 0, r)
  graphics.endFill()

  // Eye
  graphics.beginFill(0x000000)
  graphics.drawCircle(d1 * Math.cos(theta), d1 * Math.sin(theta), r * 0.66)
  graphics.endFill()

  // Retina
  graphics.beginFill(0xffffff)
  graphics.drawCircle(d2 * Math.cos(theta), d2 * Math.sin(theta), r / 4)
  graphics.endFill()

  container.addChild(graphics)
  app.stage.addChild(container)
}

const heads = { TwoEyeBranch, TwoEye, OneEye }

export default heads
