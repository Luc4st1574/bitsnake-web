import * as PIXI from 'pixi.js'

export class World {
  constructor(app, world) {
    this.app = app // Pixi Application instance
    this.world = world
    this.stroke = 25

    // Create a graphics object
    this.graphics = new PIXI.Graphics()
    this.app.stage.addChild(this.graphics)
  }

  draw() {
    // Clear previous drawings
    this.graphics.clear()

    // Set background color on the app
    this.app.renderer.background.color = 0x9333ea

    // Draw the circle (border + fill)
    this.graphics.lineStyle(this.stroke, 0x9333ea) // Stroke color
    this.graphics.beginFill(0x0f1620) // Fill color
    this.graphics.drawCircle(
      this.world.xcenter,
      this.world.ycenter,
      this.world.diameter / 2 // Pixi uses radius, p5 used diameter
    )
    this.graphics.endFill()
  }
}

export default World
