import { Application } from 'pixi.js'
import router from '@/router'
import { useGameStore } from '../stores/game'
import { log, styles } from './utils/log'

import { World, Snake, Food } from './entities'
import Camera from './modules/Camera'

// States
let world = null
let snakes = new Map()
let foods = new Map()

const getStates = async (app, room, gameStore) => {
  try {
    // State listeners
    room.state.listen('stageName', (value) => {
      gameStore.room.stageName = value
    })
    room.state.listen('maxPlayers', (value) => {
      gameStore.room.maxPlayers = value
    })

    room.state.listen('world', (state) => {
      world = new World(app, state)
      state.onChange = () => {
        world = new World(app, state)
        gameStore.room.worldSize = state.diameter
      }
    })

    room.state.snakes.onAdd = (state, sessionId) => {
      snakes.set(sessionId, new Snake(app, state))
      if (room.sessionId === sessionId) gameStore.connect = true
      gameStore.room.playersCount += 1

      state.onChange = () => {
        const snake = snakes.get(sessionId)
        snake.update()

        if (room.sessionId === sessionId) {
          gameStore.player.fps = Math.round(app.ticker.FPS)
          gameStore.player.x = snake.x
          gameStore.player.y = snake.y

          gameStore.player.alive = state.alive
          gameStore.player.score = state.score
          gameStore.player.rank = state.rank
          gameStore.player.earn = state.earn
          gameStore.player.kills = state.kills

          gameStore.player.ping = snake.serverTime
        }
      }
    }

    room.state.snakes.onRemove = (snake, sessionId) => {
      if (room.sessionId === sessionId) {
        gameStore.alive = false
      }
      gameStore.room.playersCount -= 1
      snakes.delete(sessionId)
    }

    room.state.foods.onAdd = (food) => {
      foods.set(food.id, new Food(app, food))
    }

    room.state.foods.onRemove = (food) => {
      foods.delete(food.id)
    }

    // Room listeners
    room.onLeave((code) => {
      log(`Leave successfully [${code}]`, styles.error)
    })

    room.onError((code, message) => {
      log(`An error occurred ${code}, ${message}`, styles.error)
    })
  } catch (e) {
    router.push('/')
    console.log(e)
  }
}

export const useSketch = (room) => {
  return () => {
    const gameStore = useGameStore()
    const app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1099bb
    })

    document.getElementById('pixi-container').appendChild(app.view)

    const camera = new Camera(app)
    let trigger = false

    getStates(app, room, gameStore)

    app.ticker.add(() => {
      for (const [, food] of foods) {
        food.move()
      }
      for (const [, snake] of snakes) {
        snake.loop()
      }

      const snake = snakes.get(room?.sessionId)
      if (snake) {
        camera.setScale(snake.server.r)
        camera.follow(snake)
      }

      app.stage.scale.set(camera.scale)
      app.stage.position.set(camera.x, camera.y)

      if (world) world.draw()

      for (const [, food] of foods) {
        if (!camera.onVision(food)) continue
        food.draw()
      }
      for (const [, snake] of snakes) {
        snake.draw()
      }

      if (snake) {
        if (snake.server.alive) mouseMove()
        if (!snake.server.alive) app.stage.filters = [new PIXI.filters.ColorMatrixFilter().desaturate()]
      }
    })

    window.addEventListener('resize', () => {
      app.renderer.resize(window.innerWidth, window.innerHeight)
    })

    const mouseMove = () => {
      if (!room) return
      const x = app.renderer.plugins.interaction.mouse.global.x - app.screen.width / 2
      const y = app.renderer.plugins.interaction.mouse.global.y - app.screen.height / 2
      const theta = Math.atan2(y, x)
      room.send('mouse-move', theta)
    }

    app.view.addEventListener('pointerdown', (event) => {
      if (!room) return
      const onPress = event.button === 0
      if (onPress && !trigger) {
        room.send('mouse-press', true)
        trigger = true
      }
    })

    app.view.addEventListener('pointerup', (event) => {
      if (!room) return
      const onRelease = event.button === 0
      if (onRelease && trigger) {
        room.send('mouse-press', false)
        trigger = false
      }
    })

    return app
  }
}
