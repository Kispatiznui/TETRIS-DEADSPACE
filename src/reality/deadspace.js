import {
  GAME_EVENTS
} from '../core/events.js'

import {
  emit
} from '../core/eventBus.js'

import {
  enterDeadspace,
  exitDeadspace
} from './reality.js'

const DEADSPACE_THRESHOLD = 30
const DEADSPACE_EXIT_THRESHOLD = 45

const DEFAULT_INTENSITY = 0

export function createDeadspace() {
  return {
    active: false,
    intensity: DEFAULT_INTENSITY,
    duration: 0,
    source: null
  }
}

export function updateDeadspace(
  deadspace,
  reality,
  deltaTime
) {
  if (
    !deadspace ||
    !reality ||
    reality.collapsed
  ) {
    return
  }

  const seconds =
    Math.max(
      0,
      Number(deltaTime) || 0
    ) / 1000

  if (deadspace.active) {
    deadspace.duration +=
      seconds

    updateIntensity(
      deadspace,
      reality
    )

    if (
      shouldExitDeadspace(
        reality
      )
    ) {
      deactivateDeadspace(
        deadspace,
        reality,
        'reality-stabilized'
      )
    }

    return
  }

  if (
    shouldEnterDeadspace(
      reality
    )
  ) {
    activateDeadspace(
      deadspace,
      reality,
      'reality-instability'
    )
  }
}

export function activateDeadspace(
  deadspace,
  reality,
  source = 'unknown'
) {
  if (
    !deadspace ||
    !reality ||
    deadspace.active ||
    reality.collapsed
  ) {
    return false
  }

  const entered =
    enterDeadspace(
      reality,
      source
    )

  if (!entered) {
    return false
  }

  deadspace.active = true
  deadspace.duration = 0
  deadspace.source = source

  updateIntensity(
    deadspace,
    reality
  )

  emit(
    GAME_EVENTS.DEADSPACE_ENTERED,
    {
      intensity:
        deadspace.intensity,

      duration:
        deadspace.duration,

      source
    }
  )

  return true
}

export function deactivateDeadspace(
  deadspace,
  reality,
  source = 'unknown'
) {
  if (
    !deadspace ||
    !reality ||
    !deadspace.active
  ) {
    return false
  }

  exitDeadspace(
    reality,
    source
  )

  deadspace.active = false
  deadspace.intensity = 0
  deadspace.duration = 0
  deadspace.source = null

  emit(
    GAME_EVENTS.DEADSPACE_EXITED,
    {
      source
    }
  )

  return true
}

export function setDeadspaceIntensity(
  deadspace,
  intensity
) {
  if (!deadspace) {
    return
  }

  deadspace.intensity =
    Math.max(
      0,
      Math.min(
        100,
        Number(intensity) || 0
      )
    )
}

export function isDeadspaceActive(
  deadspace
) {
  return Boolean(
    deadspace &&
    deadspace.active
  )
}

export function getDeadspaceState(
  deadspace
) {
  if (!deadspace) {
    return null
  }

  return {
    active:
      deadspace.active,

    intensity:
      deadspace.intensity,

    duration:
      deadspace.duration,

    source:
      deadspace.source
  }
}

export function resetDeadspace(
  deadspace
) {
  if (!deadspace) {
    return
  }

  deadspace.active = false
  deadspace.intensity = 0
  deadspace.duration = 0
  deadspace.source = null
}

function shouldEnterDeadspace(
  reality
) {
  return (
    reality.stability <=
    DEADSPACE_THRESHOLD
  )
}

function shouldExitDeadspace(
  reality
) {
  return (
    reality.stability >=
    DEADSPACE_EXIT_THRESHOLD
  )
}

function updateIntensity(
  deadspace,
  reality
) {
  const instability =
    100 -
    reality.stability

  const distortion =
    reality.distortion

  const corruption =
    reality.corruption

  const intensity =
    (
      instability * 0.5 +
      distortion * 0.25 +
      corruption * 0.25
    )

  setDeadspaceIntensity(
    deadspace,
    intensity
  )
}