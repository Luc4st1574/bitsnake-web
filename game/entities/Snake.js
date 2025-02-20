import * as PIXI from 'pixi.js'
import Head from './Snake/Head'
import { getColors, getAttackColors } from '../utils/Game'
import * as Maths from '../utils/math'

export class Snake {
  constructor(app, snake) {
    this.app = app // Pixi Application instance
    this.server = snake

    this.x = snake.x
    this.y = snake.y
    this.theta = snake.theta
    this.tail = []

    this.color = getColors(snake.color)
    this.colorAttack = getAttackColors(0)

    this.drawHead = Head[snake.head]

    this.serverStamp = 0
    this.clientStamp = 0

    this.serverTime = 0
    this.clientTime = 0

    // Container for rendering the snake
    this.container = new PIXI.Container()
    this.app.stage.addChild(this.container)

    // Graphics for the snake
    this.graphics = new PIXI.Graphics()
    this.container.addChild(this.graphics)

    // Name tag
    this.nameText = new PIXI.Text(this.server.name, {
      fontSize: 15,
      fill: this.color.secondary,
      align: 'center'
    })
    this.container.addChild(this.nameText)
  }

  sync() {
    const clientLength = this.tail.length
    const serverLength = this.server.tail.length

    if (clientLength < serverLength) {
      for (let index = clientLength; index < serverLength; index++) {
        this.tail[index] = {
          x: this.server.tail[index].x,
          y: this.server.tail[index].y
        }
      }
    }

    if (clientLength > serverLength) {
      this.tail.pop()
    }
  }

  update() {
    this.serverTime = Date.now() - this.serverStamp
    this.serverStamp = Date.now()
  }

  loop() {
    const fps = Date.now() - this.clientStamp
    let t = fps / this.serverTime
    if (t > 1) t = 1

    this.sync()
    this.move(t)
    this.clientStamp = Date.now()

    this.draw()

    requestAnimationFrame(() => this.loop()) // Continuous update
  }

  move(t) {
    this.x = Maths.lerp(this.x, this.server.x, t)
    this.y = Maths.lerp(this.y, this.server.y, t)
    this.theta = this.server.theta // Maths.slerp(this.theta, this.server.theta, t)

    for (const [index, tail] of this.tail.entries()) {
      const tailSnake = this.server.tail[index]
      if (!tailSnake) continue

      tail.x = Maths.lerp(tail.x, tailSnake.x, t)
      tail.y = Maths.lerp(tail.y, tailSnake.y, t)
    }
  }

  draw() {
    if (!this.server.alive) return

    const color = this.server.v > 4 ? this.colorAttack : this.color

    this.graphics.clear() // Clear previous frame

    // Draw tail
    for (let i = this.tail.length - 1; i >= 0; i--) {
      this.drawTail(this.tail[i].x, this.tail[i].y, color)
    }

    // Draw Head
    this.drawHead(this.graphics, {
      x: this.x,
      y: this.y,
      r: this.server.r,
      theta: this.theta,
      color
    })

    // Draw Name
    this.drawName()
  }

  drawName() {
    this.nameText.text = this.server.name
    this.nameText.x = this.x - this.nameText.width / 2
    this.nameText.y = this.y + 40
  }

  drawTail(x, y, color) {
    this.graphics.lineStyle(1, color.primary)
    this.graphics.beginFill(color.secondary)
    this.graphics.drawCircle(x, y, 2 * this.server.r)
    this.graphics.endFill()
  }
}

export default Snake
