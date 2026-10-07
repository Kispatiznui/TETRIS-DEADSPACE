import {
  GAME_EVENTS
} from '../core/events.js'

import {
  on,
  emit
} from '../core/eventBus.js'

import {
  reduceStability
} from '../reality/reality.js'

import {
  DEEP_MAW_EVENTS
} from './deepMawEvents.js'

import {
  createDeepMawPresence,
  addPresence,
  getPresenceState,
  resetPresence
} from './deepMawPresence.js'

const PRESENCE_VALUES = {
  PLAYER_ERROR_SMALL: 1,
  PLAYER_ERROR_MEDIUM: 3,
  PLAYER_ERROR_LARGE: 7,
  PLAYER_ERROR_CRITICAL: 15,

  PIECE_CORRUPTED: 2,
  INTERFERENCE: 3,
  INFECTION_CREATED: 2,
  INFECTION_PROPAGATED: 3,
  OXYGEN_LOW: 2
}

const LEVEL_BEHAVIOR = {
  0: {
    corruption: false,
    interference: false,
    communication: false,
    reality: false
  },

  1: {
    corruption: false,
    interference: false,
    communication: true,
    reality: false
  },

  2: {
    corruption: true,
    interference: false,
    communication: true,
    reality: false
  },

  3: {
    corruption: true,
    interference: true,
    communication: true,
    reality: false
  },

  4: {
    corruption: true,
    interference: true,
    communication: true,
    reality: true
  },

  5: {
    corruption: true,
    interference: true,
    communication: true,
    reality: true
  },

  6: {
    corruption: true,
    interference: true,
    communication: true,
    reality: true
  }
}

export class DeepMawDirector {
  constructor() {
    this.enabled = true

    this.presence =
      createDeepMawPresence()

    this.realityInfluenceTimer = 0

    this.lastPresenceLevel = 0

    this.unsubscribe = []
  }

  init() {
    this.destroy()

    this.unsubscribe.push(
      on(
        GAME_EVENTS.PLAYER_ERROR,
        data =>
          this.observePlayerError(
            data
          )
      )
    )

    this.unsubscribe.push(
      on(
        GAME_EVENTS.PIECE_CORRUPTED,
        data =>
          this.observeCorruption(
            data
          )
      )
    )

    this.unsubscribe.push(
      on(
        GAME_EVENTS.AI_INTERFERENCE_STARTED,
        data =>
          this.observeInterference(
            data
          )
      )
    )

    this.unsubscribe.push(
      on(
        GAME_EVENTS.INFECTION_CREATED,
        data =>
          this.observeInfectionCreated(
            data
          )
      )
    )

    this.unsubscribe.push(
      on(
        GAME_EVENTS.INFECTION_PROPAGATED,
        data =>
          this.observeInfectionPropagation(
            data
          )
      )
    )

    this.unsubscribe.push(
      on(
        GAME_EVENTS.OXYGEN_LOW,
        data =>
          this.observeLowOxygen(
            data
          )
      )
    )

    console.log(
      '[DEEP MAW] Presence director initialized.'
    )
  }

  observePlayerError(
    data = {}
  ) {
    if (!this.enabled) {
      return
    }

    const magnitude =
      Math.max(
        0,
        Number(data.magnitude) || 0
      )

    if (magnitude === 0) {
      return
    }

    const amount =
      Math.min(
        PRESENCE_VALUES.PLAYER_ERROR_CRITICAL,
        magnitude
      )

    addPresence(
      this.presence,
      amount,
      data.source || 'player-error'
    )

    this.processPresenceChange(
      amount,
      data.source || 'player-error'
    )
  }

  observeCorruption(data = {}) {
    if (!this.enabled) {
      return
    }

    addPresence(
      this.presence,
      PRESENCE_VALUES.PIECE_CORRUPTED,
      'corruption'
    )

    emit(
      DEEP_MAW_EVENTS.CORRUPTION_TRIGGERED,
      {
        ...data,
        presence:
          getPresenceState(
            this.presence
          )
      }
    )

    this.processPresenceChange(
      PRESENCE_VALUES.PIECE_CORRUPTED,
      'corruption'
    )
  }

  observeInterference(data = {}) {
    if (!this.enabled) {
      return
    }

    addPresence(
      this.presence,
      PRESENCE_VALUES.INTERFERENCE,
      'interference'
    )

    emit(
      DEEP_MAW_EVENTS.INTERFERENCE_TRIGGERED,
      {
        ...data,
        presence:
          getPresenceState(
            this.presence
          )
      }
    )

    this.processPresenceChange(
      PRESENCE_VALUES.INTERFERENCE,
      'interference'
    )
  }

  observeInfectionCreated(data = {}) {
    if (!this.enabled) {
      return
    }

    addPresence(
      this.presence,
      PRESENCE_VALUES.INFECTION_CREATED,
      'infection-created'
    )

    this.processPresenceChange(
      PRESENCE_VALUES.INFECTION_CREATED,
      'infection-created'
    )
  }

  observeInfectionPropagation(
    data = {}
  ) {
    if (!this.enabled) {
      return
    }

    addPresence(
      this.presence,
      PRESENCE_VALUES.INFECTION_PROPAGATED,
      'infection-propagated'
    )

    this.processPresenceChange(
      PRESENCE_VALUES.INFECTION_PROPAGATED,
      'infection-propagated'
    )
  }

  observeLowOxygen(data = {}) {
    if (!this.enabled) {
      return
    }

    addPresence(
      this.presence,
      PRESENCE_VALUES.OXYGEN_LOW,
      'oxygen-low'
    )

    this.processPresenceChange(
      PRESENCE_VALUES.OXYGEN_LOW,
      'oxygen-low'
    )
  }

  update(
    deltaTime,
    reality
  ) {
    if (
      !this.enabled ||
      !reality
    ) {
      return
    }

    this.realityInfluenceTimer +=
      deltaTime

    if (
      this.realityInfluenceTimer <
      1000
    ) {
      return
    }

    this.realityInfluenceTimer = 0

    this.influenceReality(
      reality
    )
  }

  influenceReality(reality) {
    const level =
      this.presence.level

    const behavior =
      LEVEL_BEHAVIOR[level]

    if (
      !behavior ||
      !behavior.reality
    ) {
      return
    }

    const stabilityLoss =
      level >= 6
        ? 2
        : level >= 5
          ? 1
          : 0.5

    reduceStability(
      reality,
      stabilityLoss,
      'the-deep-maw'
    )

    emit(
      DEEP_MAW_EVENTS.REALITY_INFLUENCED,
      {
        amount:
          stabilityLoss,

        level,

        presence:
          getPresenceState(
            this.presence
          )
      }
    )
  }

  processPresenceChange(
    amount,
    source
  ) {
    const state =
      getPresenceState(
        this.presence
      )

    emit(
      DEEP_MAW_EVENTS.PRESENCE_CHANGED,
      {
        amount,
        source,
        ...state
      }
    )

    if (
      state.level !==
      this.lastPresenceLevel
    ) {
      this.lastPresenceLevel =
        state.level

      emit(
        DEEP_MAW_EVENTS.PRESENCE_LEVEL_CHANGED,
        {
          level:
            state.level,

          presence:
            state.value,

          source
        }
      )

      this.onPresenceLevel(
        state.level
      )
    }

    if (
      amount >=
      PRESENCE_VALUES.PLAYER_ERROR_LARGE
    ) {
      emit(
        DEEP_MAW_EVENTS.PRESENCE_SURGE,
        {
          amount,
          source,
          ...state
        }
      )
    }
  }

  onPresenceLevel(level) {
    const behavior =
      LEVEL_BEHAVIOR[level]

    if (!behavior) {
      return
    }

    if (
      behavior.communication
    ) {
      emit(
        DEEP_MAW_EVENTS.COMMUNICATION_TRIGGERED,
        {
          level,
          presence:
            this.presence.value
        }
      )
    }

    if (
      level >= 5
    ) {
      emit(
        DEEP_MAW_EVENTS.DEADSPACE_OPENED,
        {
          level,
          presence:
            this.presence.value
        }
      )
    }
  }

  getState() {
    return {
      ...getPresenceState(
        this.presence
      ),

      enabled:
        this.enabled,

      realityInfluenceTimer:
        this.realityInfluenceTimer
    }
  }

  reset() {
    resetPresence(
      this.presence
    )

    this.realityInfluenceTimer = 0
    this.lastPresenceLevel = 0
  }

  destroy() {
    this.unsubscribe.forEach(
      unsubscribe =>
        unsubscribe()
    )

    this.unsubscribe = []
  }
}