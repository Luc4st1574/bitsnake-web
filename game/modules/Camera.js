import * as Maths from '../utils/math'

const SNAKE_MAX_SIZE = 30
const SNAKE_MIN_SIZE = 15

export default class Camera {
  constructor(p) {
    this.p = p
    this.init = false

    this.x = 0
    this.y = 0

    this.clientStamp = 0
    this.clientTime = 0
  }

  setScale(size) {
    //0.5,1
    this.scale = Maths.normalize(
      Math.floor(size),
      SNAKE_MAX_SIZE,
      SNAKE_MIN_SIZE,
      0.5,
      1
    )
    // console.log(size)
  }

  follow(obj) {
    //let t = 1 / this.p.frameRate()

    const xcenter = this.p.width / (2 * this.scale) - obj.x
    const ycenter = this.p.height / (2 * this.scale) - obj.y

    this.x = xcenter
    this.y = ycenter
  }

  onVision(obj) {
    return (
      obj.x > -this.x - this.p.width &&
      obj.x < -this.x + this.p.width &&
      obj.y > -this.y - this.p.height &&
      obj.y < -this.y + this.p.height
    )
  }
}
