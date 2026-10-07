import {
  GAME_EVENTS
} from '../core/events.js'

import {
  emit
} from '../core/eventBus.js'

const MAX_STABILITY = 100
const MIN_STABILITY = 0

const DEFAULT_STABILITY = 100

export function createReality() {
  return {
    stability: DEFAULT_STABILITY,
    distortion: 0,
    corruption: 0,
    deadspace: false,
    collapsed: false
  }
}

export function reduceStability(
  reality,
  amount,
  source = 'unknown'
) {
  if (!reality || reality.collapsed) {
    return
  }

  const value =
    Math.max(
      0,
      Number(amount) || 0
    )

  if (value === 0) {
    return
  }

  reality.stability =
    Math.max(
      MIN_STABILITY,
      reality.stability - value
    )

  emit(
    GAME_EVENTS.REALITY_SHIFT,
    {
      stability:
        reality.stability,

      amount: value,
      source
    }
  )

  checkRealityState(reality)
}

export function increaseDistortion(
  reality,
  amount,
  source = 'unknown'
) {
  if (!reality || reality.collapsed) {
    return
  }

  const value =
    Math.max(
      0,
      Number(amount) || 0
    )

  if (value === 0) {
    return
  }

  reality.distortion =
    Math.min(
      100,
      reality.distortion + value
    )

  emit(
    GAME_EVENTS.REALITY_CORRUPTED,
    {
      distortion:
        reality.distortion,

      amount: value,
      source
    }
  )
}

export function increaseCorruption(
  reality,
  amount,
  source = 'unknown'
) {
  if (!reality || reality.collapsed) {
    return
  }

  const value =
    Math.max(
      0,
      Number(amount) || 0
    )

  if (value === 0) {
    return
  }

  reality.corruption =
    Math.min(
      100,
      reality.corruption + value
    )

  emit(
    GAME_EVENTS.REALITY_CORRUPTED,
    {
      corruption:
        reality.corruption,

      amount: value,
      source
    }
  )
}

export function enterDeadspace(
  reality,
  source = 'unknown'
) {
  if (
    !reality ||
    reality.collapsed ||
    reality.deadspace
  ) {
    return false
  }

  reality.deadspace = true

  emit(
    GAME_EVENTS.DEADSPACE_ENTERED,
    {
      stability:
        reality.stability,

      distortion:
        reality.distortion,

      corruption:
        reality.corruption,

      source
    }
  )

  return true
}

export function exitDeadspace(
  reality,
  source = 'unknown'
) {
  if (
    !reality ||
    reality.collapsed ||
    !reality.deadspace
  ) {
    return false
  }

  reality.deadspace = false

  emit(
    GAME_EVENTS.DEADSPACE_EXITED,
    {
      stability:
        reality.stability,

      distortion:
        reality.distortion,

      corruption:
        reality.corruption,

      source
    }
  )

  return true
}

export function collapseReality(
  reality,
  source = 'unknown'
) {
  if (
    !reality ||
    reality.collapsed
  ) {
    return false
  }

  reality.stability =
    MIN_STABILITY

  reality.deadspace = true
  reality.collapsed = true

  emit(
    GAME_EVENTS.REALITY_COLLAPSE,
    {
      stability: 0,
      distortion:
        reality.distortion,
      corruption:
        reality.corruption,
      source
    }
  )

  return true
}

export function restoreStability(
  reality,
  amount
) {
  if (
    !reality ||
    reality.collapsed
  ) {
    return
  }

  const value =
    Math.max(
      0,
      Number(amount) || 0
    )

  reality.stability =
    Math.min(
      MAX_STABILITY,
      reality.stability + value
    )
}

export function getRealityState(
  reality
) {
  if (!reality) {
    return null
  }

  return {
    stability:
      reality.stability,

    distortion:
      reality.distortion,

    corruption:
      reality.corruption,

    deadspace:
      reality.deadspace,

    collapsed:
      reality.collapsed
  }
}

export function resetReality(
  reality
) {
  if (!reality) {
    return
  }

  reality.stability =
    DEFAULT_STABILITY

  reality.distortion = 0
  reality.corruption = 0
  reality.deadspace = false
  reality.collapsed = false
}

function checkRealityState(
  reality
) {
  if (
    reality.stability <= 0
  ) {
    collapseReality(
      reality,
      'stability-depleted'
    )
  }
}