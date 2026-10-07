import {
  getRandomMessage
} from './messages.js'

import {
  shouldInterfere,
  createInterference,
  updateInterference,
  isInterferenceActive
} from './interference.js'

import {
  shouldCorruptPiece,
  corruptPiece
} from './corruption.js'

import {
  GAME_EVENTS
} from '../core/events.js'

import {
  emit
} from '../core/eventBus.js'

const AI_EVENTS = {
  PIECE_SPAWNED: 'PIECE_SPAWNED',
  PIECE_MOVED: 'PIECE_MOVED',
  PIECE_ROTATED: 'PIECE_ROTATED',
  PIECE_LOCKED: 'PIECE_LOCKED',
  LINE_CLEARED: 'LINE_CLEARED',
  INFECTION_CREATED: 'INFECTION_CREATED',
  INFECTION_PROPAGATED: 'INFECTION_PROPAGATED',
  OXYGEN_LOW: 'OXYGEN_LOW',
  OXYGEN_DEPLETED: 'OXYGEN_DEPLETED',
  PLAYER_MISTAKE: 'PLAYER_MISTAKE',
  GAME_OVER: 'GAME_OVER'
}

export class AIDirector {
  constructor() {
    this.enabled = true
    this.interference = null

    this.state = {
      piecesPlayed: 0,
      linesCleared: 0,
      infectedPieces: 0,
      infectionEvents: 0,
      oxygenLowEvents: 0,
      mistakes: 0,
      lastEvent: null,
      lastEventTime: 0
    }
  }

  init() {
    console.log(
      '[AI] Hostile AI initialized.'
    )
  }

  observe(event, data = {}) {
    if (!this.enabled) {
      return
    }

    this.state.lastEvent = event
    this.state.lastEventTime =
      performance.now()

    switch (event) {
      case AI_EVENTS.PIECE_SPAWNED:
        this.handlePieceSpawned(data)
        break

      case AI_EVENTS.PIECE_MOVED:
        this.handlePieceMoved(data)
        break

      case AI_EVENTS.PIECE_ROTATED:
        this.handlePieceRotated(data)
        break

      case AI_EVENTS.PIECE_LOCKED:
        this.handlePieceLocked(data)
        break

      case AI_EVENTS.LINE_CLEARED:
        this.handleLineCleared(data)
        break

      case AI_EVENTS.INFECTION_CREATED:
        this.handleInfectionCreated(data)
        break

      case AI_EVENTS.INFECTION_PROPAGATED:
        this.handleInfectionPropagated(data)
        break

      case AI_EVENTS.OXYGEN_LOW:
        this.handleOxygenLow(data)
        break

      case AI_EVENTS.OXYGEN_DEPLETED:
        this.handleOxygenDepleted(data)
        break

      case AI_EVENTS.PLAYER_MISTAKE:
        this.handlePlayerMistake(data)
        break

      case AI_EVENTS.GAME_OVER:
        this.handleGameOver(data)
        break

      default:
        console.warn(
          `[AI] Unknown event: ${event}`
        )
    }
  }

  handlePieceSpawned(data) {
    console.log(
      '[AI] Observing piece spawn.',
      data
    )

    this.state.piecesPlayed++
  }

  handlePieceMoved(data) {
    /*
     * La IA observa los movimientos.
     *
     * Más adelante estos datos podrán
     * alimentar el sistema de errores
     * del jugador.
     */
  }

  handlePieceRotated(data) {
    /*
     * Reservado para análisis
     * del comportamiento del jugador.
     */
  }

  handlePieceLocked(data) {
    console.log(
      '[AI] Piece locked.',
      data
    )
  }

  handleLineCleared(data) {
    const lines =
      Number(data.lines) || 0

    this.state.linesCleared +=
      lines

    console.log(
      `[AI] Player cleared ${lines} line(s).`
    )
  }

  handleInfectionCreated(data) {
    this.state.infectedPieces++

    console.log(
      '[AI] Infection detected.',
      data
    )

    this.emitMessage(
      'INFECTION'
    )
  }

  handleInfectionPropagated(data) {
    this.state.infectionEvents++

    console.log(
      '[AI] Infection propagation detected.',
      data
    )
  }

  handleOxygenLow(data) {
    this.state.oxygenLowEvents++

    console.log(
      '[AI] Oxygen level critical.',
      data
    )

    this.emitMessage(
      'OXYGEN'
    )
  }

  handleOxygenDepleted(data) {
    console.log(
      '[AI] Oxygen depleted.',
      data
    )
  }

  handlePlayerMistake(data) {
    this.state.mistakes++

    console.log(
      '[AI] Player mistake detected.',
      data
    )

    this.emitMessage(
      'MISTAKE'
    )
  }

  handleGameOver(data) {
    console.log(
      '[AI] Game over observed.',
      data
    )

    this.emitMessage(
      'THREAT'
    )
  }

  /*
   * =========================
   * PIECE CORRUPTION
   * =========================
   */

  corrupt(piece) {
    if (
      !this.enabled ||
      !piece
    ) {
      return piece
    }

    if (
      !shouldCorruptPiece()
    ) {
      return piece
    }

    const corruptedPiece =
      corruptPiece(piece)

    console.log(
      '[AI] PIECE CORRUPTED.',
      corruptedPiece
    )

    this.emitMessage(
      'THREAT'
    )

    return corruptedPiece
  }

  /*
   * =========================
   * INTERFERENCE
   * =========================
   */

  triggerInterference() {
    if (!this.enabled) {
      return null
    }

    if (
      this.isInterferenceActive()
    ) {
      return null
    }

    if (
      !shouldInterfere()
    ) {
      return null
    }

    this.interference =
      createInterference()

    emit(
      GAME_EVENTS.AI_INTERFERENCE_STARTED,
      {
        type:
          this.interference.type,

        duration:
          this.interference.remaining
      }
    )

    console.log(
      '[AI] INTERFERENCE ACTIVATED.',
      this.interference.type
    )

    this.emitMessage(
      'THREAT'
    )

    return this.interference
  }

  updateInterference(deltaTime) {
    if (
      !this.interference
    ) {
      return
    }

    updateInterference(
      this.interference,
      deltaTime
    )

    if (
      !isInterferenceActive(
        this.interference
      )
    ) {
      const endedInterference =
        this.interference

      console.log(
        '[AI] INTERFERENCE ENDED.'
      )

      emit(
        GAME_EVENTS.AI_INTERFERENCE_ENDED,
        {
          type:
            endedInterference.type
        }
      )

      this.interference = null
    }
  }

  isInterferenceActive() {
    return isInterferenceActive(
      this.interference
    )
  }

  /*
   * =========================
   * MESSAGES
   * =========================
   */

  emitMessage(category) {
    const message =
      getRandomMessage(category)

    if (!message) {
      return null
    }

    console.log(
      `[AI] ${message}`
    )

    return message
  }

  /*
   * =========================
   * STATE
   * =========================
   */

  getState() {
    return {
      ...this.state,

      interference:
        this.interference
          ? {
              active:
                this.interference.active,

              type:
                this.interference.type,

              remaining:
                this.interference.remaining
            }
          : null
    }
  }

  reset() {
    this.interference = null

    this.state = {
      piecesPlayed: 0,
      linesCleared: 0,
      infectedPieces: 0,
      infectionEvents: 0,
      oxygenLowEvents: 0,
      mistakes: 0,
      lastEvent: null,
      lastEventTime: 0
    }
  }
}

export {
  AI_EVENTS
}