import {
  getDebugState,
  debugSetOxygen
} from '../core/game.js'


export class DebugMode {
  constructor() {
    this.enabled =
      new URLSearchParams(
        window.location.search
      ).get('tetrisDebug') === '1'
  }

  init() {
    if (!this.enabled) {
      return
    }

    window.debug = this

    console.log(
      '[DEBUG] TETRIS: DEADSPACE debug mode enabled.'
    )

    console.log(
      '[DEBUG] Type debug.help() for available commands.'
    )
  }

  help() {
    if (!this.enabled) {
      return
    }

    console.log(`
TETRIS: DEADSPACE — DEBUG

Available commands:

  debug.help()
  debug.state()

Debug system initialized.
More commands will be added as game systems are exposed.
    `)
  }

  state() {
    if (!this.enabled) {
      return
    }

    console.table(
      getDebugState()
    )
  }

  setOxygen(value) {
  if (!this.enabled) {
    return
  }

  const oxygen =
    Number(value)

  if (!Number.isFinite(oxygen)) {
    console.warn(
      '[DEBUG] Oxygen must be a number.'
    )

    return
  }

  const changed =
    debugSetOxygen(oxygen)

  if (!changed) {
    console.warn(
      '[DEBUG] Game is not running.'
    )

    return
  }

  console.log(
    `[DEBUG] Oxygen set to ${oxygen}.`
  )
  }
}