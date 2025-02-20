import * as PIXI from 'pixi.js'
import { lighten } from 'color2k'
import { randomInt } from '../utils/math'

export const foods = [
  { id: 0, v: 0.1, color: 0x3498db }, // RGB converted to Hex for PixiJS
  { id: 1, v: 0.1, color: 0x28b463 },
  { id: 2, v: 0.1, color: 0xd4ac0d },
  { id: 3, v: 0.1, color: 0x8e44ad },
  { id: 4, v: 0.1, color: 0xe74c3c }
]

export class Food {
  constructor(app, food) {
    this.app = app
    this.food = food
    this.x = food.x
    this.y = food.y
    this.r = food.r / 2
    this.m = food.r

    this.vx = randomInt(-1, 1)
    this.vy = randomInt(-1, 1)

    const type = food.type
    this.v = foods[type].v
    this.mainColor = foods[type].color

    // Approximate color lightening (PixiJS doesn't have built-in lighten)
    const rgb = PIXI.utils.hex2rgb(this.mainColor)
    this.supportColor = PIXI.utils.rgb2hex([
      Math.min(rgb[0] + 0.15, 1),
      Math.min(rgb[1] + 0.15, 1),
      Math.min(rgb[2] + 0.15, 1)
    ])

    // Bounds for movement
    const w = this.m
    const h = this.m / 1.5

    this.boundary = {
      left: this.x - w,
      right: this.x + w,
      top: this.y - h,
      bottom: this.y + h
    }

    // Create a container for food
    this.container = new PIXI.Container()
    this.container.position.set(this.x, this.y)

    // Create graphics for food
    this.graphics = new PIXI.Graphics()
    this.container.addChild(this.graphics)

    this.app.stage.addChild(this.container)
    this.draw()
  }

  move() {
    const x = this.x
    const y = this.y
    const m = this.r

    const onLeft = x - m < this.boundary.left
    const onRight = x + m > this.boundary.right
    const onTop = y - m < this.boundary.top
    const onBottom = y + m > this.boundary.bottom

    if (onLeft) this.vx = 1
    if (onRight) this.vx = -1
    if (onTop) this.vy = 1
    if (onBottom) this.vy = -1

    this.x += this.vx * this.v
    this.y += this.vy * this.v

    // Update position in Pixi
    this.container.position.set(this.x, this.y)

    this.draw()
  }

  draw() {
    this.graphics.clear()

    // Outer circle (Main Color)
    this.graphics.beginFill(this.mainColor)
    this.graphics.drawCircle(0, 0, 2 * this.r)
    this.graphics.endFill()

    // Inner circle (Support Color)
    this.graphics.beginFill(this.supportColor)
    this.graphics.drawCircle(0, 0, this.r)
    this.graphics.endFill()
  }
}
