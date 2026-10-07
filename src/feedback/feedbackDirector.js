import {
  GAME_EVENTS
} from '../core/events.js'

import {
  DEEP_MAW_EVENTS
} from '../deepmaw/deepMawEvents.js'

import {
  on,
  emit
} from '../core/eventBus.js'

import {
  getRandomMessage,
  getDeepMawMessage
} from './feedbackMessages.js'

import {
  createVisualEffect
} from './feedbackVisual.js'

const FEEDBACK_EVENTS = {
  MESSAGE: 'feedback:message',
  VISUAL: 'feedback:visual',
  AUDIO: 'feedback:audio'
}

const MESSAGE_PRIORITY = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  CRITICAL: 4
}

const MESSAGE_DURATION = {
  LOW: 1800,
  NORMAL: 2200,
  HIGH: 2800,
  CRITICAL: 4000
}

export class FeedbackDirector {
  constructor() {
    this.enabled = true

    this.currentMessage = null
    this.messageTimer = 0

    this.state = {
      messagesShown: 0,
      visualEvents: 0,
      audioEvents: 0,
      lastMessage: null,
      lastEvent: null
    }

    this.unsubscribe = []
  }

  init() {
    this.destroy()

    this.subscribeToGameEvents()

    console.log(
      '[FEEDBACK] Feedback system initialized.'
    )
  }

  subscribeToGameEvents() {
    this.subscribe(
      GAME_EVENTS.OXYGEN_LOW,
      data => {
        this.showFeedback(
          'OXYGEN_LOW',
          'HIGH',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.OXYGEN_DEPLETED,
      data => {
        this.showFeedback(
          'OXYGEN_DEPLETED',
          'CRITICAL',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.PIECE_CORRUPTED,
      data => {
        this.showFeedback(
          'PIECE_CORRUPTED',
          'HIGH',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.INFECTION_CREATED,
      data => {
        this.showFeedback(
          'INFECTION_CREATED',
          'NORMAL',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.INFECTION_PROPAGATED,
      data => {
        this.showFeedback(
          'INFECTION_PROPAGATED',
          'HIGH',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.INFECTION_CONTAINED,
      data => {
        this.showFeedback(
          'INFECTION_CONTAINED',
          'NORMAL',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.AI_INTERFERENCE_STARTED,
      data => {
        this.showFeedback(
          'AI_INTERFERENCE_STARTED',
          'HIGH',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.AI_INTERFERENCE_ENDED,
      data => {
        this.showFeedback(
          'AI_INTERFERENCE_ENDED',
          'LOW',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.REALITY_SHIFT,
      data => {
        this.handleRealityShift(
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.REALITY_CORRUPTED,
      data => {
        this.handleRealityCorruption(
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.DEADSPACE_ENTERED,
      data => {
        this.showFeedback(
          'DEADSPACE_ENTERED',
          'CRITICAL',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.DEADSPACE_EXITED,
      data => {
        this.showFeedback(
          'DEADSPACE_EXITED',
          'NORMAL',
          data
        )
      }
    )

    this.subscribe(
      GAME_EVENTS.REALITY_COLLAPSE,
      data => {
        this.showFeedback(
          'REALITY_COLLAPSE',
          'CRITICAL',
          data
        )
      }
    )

    /*
     * =========================
     * DEEP MAW
     * =========================
     */

    this.subscribe(
      DEEP_MAW_EVENTS.PRESENCE_SURGE,
      data => {
        this.handleDeepMawPresenceSurge(
          data
        )
      }
    )

    this.subscribe(
      DEEP_MAW_EVENTS.CORRUPTION_TRIGGERED,
      data => {
        this.handleDeepMawCorruption(
          data
        )
      }
    )

    this.subscribe(
      DEEP_MAW_EVENTS.INTERFERENCE_TRIGGERED,
      data => {
        this.handleDeepMawInterference(
          data
        )
      }
    )

    this.subscribe(
      DEEP_MAW_EVENTS.COMMUNICATION_TRIGGERED,
      data => {
        this.handleDeepMawCommunication(
          data
        )
      }
    )

    this.subscribe(
      DEEP_MAW_EVENTS.REALITY_INFLUENCED,
      data => {
        this.handleDeepMawReality(
          data
        )
      }
    )

    this.subscribe(
      DEEP_MAW_EVENTS.DEADSPACE_OPENED,
      data => {
        this.handleDeepMawDeadspace(
          data
        )
      }
    )
  }

  subscribe(
    event,
    callback
  ) {
    const unsubscribe =
      on(
        event,
        callback
      )

    this.unsubscribe.push(
      unsubscribe
    )
  }

  /*
   * =========================
   * GENERIC FEEDBACK
   * =========================
   */

  showFeedback(
    type,
    priority = 'NORMAL',
    data = {}
  ) {
    const message =
      getRandomMessage(
        type,
        data
      )

    if (message) {
      this.showMessage(
        message,
        priority
      )
    }

    this.triggerVisual(
      type,
      data
    )

    this.triggerAudio(
      type,
      data
    )
  }

  /*
   * =========================
   * REALITY
   * =========================
   */

  handleRealityShift(data) {
    if (!data) {
      return
    }

    const stability =
      Number(
        data.stability
      )

    if (
      !Number.isFinite(
        stability
      )
    ) {
      return
    }

    if (stability <= 30) {
      const message =
        getRandomMessage(
          'REALITY_UNSTABLE',
          data
        )

      this.showMessage(
        message ||
          'ESTABILIDAD DE REALIDAD: CRÍTICA.',
        'HIGH'
      )

      this.triggerVisual(
        'REALITY_UNSTABLE',
        data
      )

      return
    }

    if (stability <= 60) {
      const message =
        getRandomMessage(
          'REALITY_SHIFT',
          data
        )

      this.showMessage(
        message ||
          'ANOMALÍA ESTRUCTURAL DETECTADA.',
        'NORMAL'
      )

      this.triggerVisual(
        'REALITY_SHIFT',
        data
      )
    }
  }

  handleRealityCorruption(data) {
    if (!data) {
      return
    }

    const corruption =
      Number(
        data.corruption
      )

    const distortion =
      Number(
        data.distortion
      )

    if (
      Number.isFinite(
        corruption
      ) &&
      corruption >= 50
    ) {
      const message =
        getRandomMessage(
          'REALITY_CORRUPTED',
          data
        )

      this.showMessage(
        message ||
          'LA REALIDAD ESTÁ CAMBIANDO.',
        'HIGH'
      )
    }

    if (
      Number.isFinite(
        distortion
      ) &&
      distortion >= 50
    ) {
      this.triggerVisual(
        'REALITY_DISTORTION',
        data
      )
    }
  }

  /*
   * =========================
   * DEEP MAW
   * =========================
   */

  handleDeepMawPresenceSurge(data) {
    const message =
      getDeepMawMessage(
        'surge',
        data
      )

    this.showMessage(
      message ||
        this.getPresenceMessage(
          data
        ),
      'HIGH'
    )

    this.triggerVisual(
      'DEEP_MAW_PRESENCE_SURGE',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_PRESENCE_SURGE',
      data
    )
  }

  handleDeepMawCorruption(data) {
    const message =
      getDeepMawMessage(
        'corruption',
        data
      )

    this.showMessage(
      message ||
        'ALGO HA CAMBIADO.',
      'HIGH'
    )

    this.triggerVisual(
      'DEEP_MAW_CORRUPTION',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_CORRUPTION',
      data
    )
  }

  handleDeepMawInterference(data) {
    const message =
      getDeepMawMessage(
        'interference',
        data
      )

    this.showMessage(
      message ||
        'NO FUE TU MOVIMIENTO.',
      'HIGH'
    )

    this.triggerVisual(
      'DEEP_MAW_INTERFERENCE',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_INTERFERENCE',
      data
    )
  }

  handleDeepMawCommunication(data) {
    const message =
      getDeepMawMessage(
        'communication',
        data
      ) ||
      data?.message ||
      '¿LO VISTE?'

    this.showMessage(
      message,
      'HIGH'
    )

    this.triggerVisual(
      'DEEP_MAW_COMMUNICATION',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_COMMUNICATION',
      data
    )
  }

  handleDeepMawReality(data) {
    const message =
      getDeepMawMessage(
        'reality',
        data
      )

    if (message) {
      this.showMessage(
        message,
        'HIGH'
      )
    }

    this.triggerVisual(
      'DEEP_MAW_REALITY',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_REALITY',
      data
    )
  }

  handleDeepMawDeadspace(data) {
    const message =
      getDeepMawMessage(
        'deadspace',
        data
      )

    this.showMessage(
      message ||
        'LA REALIDAD NO COINCIDE.',
      'CRITICAL'
    )

    this.triggerVisual(
      'DEEP_MAW_DEADSPACE',
      data
    )

    this.triggerAudio(
      'DEEP_MAW_DEADSPACE',
      data
    )
  }

  getPresenceMessage(data) {
    const level =
      Number(
        data?.level
      )

    if (level >= 6) {
      return 'NO ESTÁS DONDE CREES.'
    }

    if (level >= 5) {
      return 'LA REALIDAD NO COINCIDE.'
    }

    if (level >= 4) {
      return 'ESTÁ OBSERVANDO.'
    }

    if (level >= 3) {
      return 'ALGO ESTÁ AQUÍ.'
    }

    return '¿LO VISTE?'
  }

  /*
   * =========================
   * MESSAGE SYSTEM
   * =========================
   */

  showMessage(
    message,
    priority = 'NORMAL'
  ) {
    if (
      !this.enabled ||
      !message
    ) {
      return
    }

    const duration =
      MESSAGE_DURATION[
        priority
      ] ||
      MESSAGE_DURATION.NORMAL

    const priorityValue =
      MESSAGE_PRIORITY[
        priority
      ] ||
      MESSAGE_PRIORITY.NORMAL

    if (
      this.currentMessage &&
      this.currentMessage.priority >
        priorityValue
    ) {
      return
    }

    this.currentMessage = {
      text: message,
      priority:
        priorityValue,
      remaining:
        duration
    }

    this.messageTimer =
      duration

    this.state.messagesShown++

    this.state.lastMessage =
      message

    emit(
      FEEDBACK_EVENTS.MESSAGE,
      {
        text: message,
        priority,
        duration
      }
    )
  }

  /*
   * =========================
   * VISUAL SYSTEM
   * =========================
   */

  triggerVisual(
    type,
    data = {}
  ) {
    if (!this.enabled) {
      return
    }

    this.state.visualEvents++

    this.state.lastEvent =
      type

    const effect =
      createVisualEffect(
        type,
        data
      )

    if (!effect) {
      return
    }

    emit(
      FEEDBACK_EVENTS.VISUAL,
      {
        type:
          effect.type ||
          type,

        intensity:
          effect.intensity,

        duration:
          effect.duration,

        data
      }
    )
  }

  /*
   * =========================
   * AUDIO SYSTEM
   * =========================
   */

  triggerAudio(
    type,
    data = {}
  ) {
    if (!this.enabled) {
      return
    }

    this.state.audioEvents++

    emit(
      FEEDBACK_EVENTS.AUDIO,
      {
        type,
        data
      }
    )
  }

  /*
   * =========================
   * UPDATE
   * =========================
   */

  update(deltaTime) {
    if (
      !this.currentMessage
    ) {
      return
    }

    this.currentMessage.remaining -=
      deltaTime

    this.messageTimer =
      this.currentMessage.remaining

    if (
      this.currentMessage.remaining <= 0
    ) {
      this.currentMessage = null
      this.messageTimer = 0

      emit(
        FEEDBACK_EVENTS.MESSAGE,
        {
          text: null
        }
      )
    }
  }

  /*
   * =========================
   * STATE
   * =========================
   */

  getCurrentMessage() {
    return this.currentMessage
      ? {
          ...this.currentMessage
        }
      : null
  }

  getState() {
    return {
      enabled:
        this.enabled,

      currentMessage:
        this.getCurrentMessage(),

      messagesShown:
        this.state.messagesShown,

      visualEvents:
        this.state.visualEvents,

      audioEvents:
        this.state.audioEvents,

      lastMessage:
        this.state.lastMessage,

      lastEvent:
        this.state.lastEvent
    }
  }

  /*
   * =========================
   * RESET
   * =========================
   */

  reset() {
    this.currentMessage = null
    this.messageTimer = 0

    this.state = {
      messagesShown: 0,
      visualEvents: 0,
      audioEvents: 0,
      lastMessage: null,
      lastEvent: null
    }
  }

  /*
   * =========================
   * DESTROY
   * =========================
   */

  destroy() {
    this.unsubscribe.forEach(
      unsubscribe => {
        unsubscribe()
      }
    )

    this.unsubscribe = []
  }
}

export {
  FEEDBACK_EVENTS
}