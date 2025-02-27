import * as PIXI from 'pixi.js';
import * as Maths from '../utils/math';

const SNAKE_MAX_SIZE = 30;
const SNAKE_MIN_SIZE = 15;

export default class Camera {
  constructor(app) {
    this.app = app; // PixiJS Application instance
    this.init = false;

    this.x = 0;
    this.y = 0;

    this.clientStamp = 0;
    this.clientTime = 0;

    this.scale = 1; // Default scale
  }

  setScale(size) {
    // Normalize size to a scale between 0.5 and 1
    this.scale = Maths.normalize(
      Math.floor(size),
      SNAKE_MAX_SIZE,
      SNAKE_MIN_SIZE,
      0.5,
      1
    );
    this.app.stage.scale.set(this.scale);
  }

  follow(obj) {
    // Center the camera on the object
    const xcenter = this.app.renderer.width / (2 * this.scale) - obj.x;
    const ycenter = this.app.renderer.height / (2 * this.scale) - obj.y;

    this.x = xcenter;
    this.y = ycenter;

    this.app.stage.position.set(this.x, this.y);
  }

  onVision(obj) {
    // Check if the object is within the visible area of the camera
    const left = -this.x;
    const right = -this.x + this.app.renderer.width;
    const top = -this.y;
    const bottom = -this.y + this.app.renderer.height;

    return (
      obj.x > left &&
      obj.x < right &&
      obj.y > top &&
      obj.y < bottom
    );
  }
}
