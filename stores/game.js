import { defineStore } from 'pinia'

export const useGameStore = defineStore({
  id: 'game',
  state: () => ({
    room: {
      stageName: null,
      maxPlayers: 0,
      playersCount: 0,
      worldSize: 0
    },
    player: {
      alive: false,
      ping: 0,
      fps: 0,
      score: 0,
      rank: 0,
      earn: 0,
      kills: 0,
      x: 0,
      y: 0
    }
  })
})
