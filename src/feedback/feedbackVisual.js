const VISUAL_EFFECTS = {
  OXYGEN_LOW: {
    type: 'VIGNETTE',
    intensity: 0.35,
    duration: 700
  },

  OXYGEN_DEPLETED: {
    type: 'CRITICAL_FLASH',
    intensity: 1,
    duration: 1200
  },

  PIECE_CORRUPTED: {
    type: 'GLITCH',
    intensity: 0.45,
    duration: 350
  },

  INFECTION_CREATED: {
    type: 'BIOLOGICAL_PULSE',
    intensity: 0.3,
    duration: 500
  },

  INFECTION_PROPAGATED: {
    type: 'CORRUPTION_PULSE',
    intensity: 0.55,
    duration: 700
  },

  INFECTION_CONTAINED: {
    type: 'CONTAINMENT_FLASH',
    intensity: 0.25,
    duration: 400
  },

  AI_INTERFERENCE_STARTED: {
    type: 'SIGNAL_GLITCH',
    intensity: 0.65,
    duration: 700
  },

  AI_INTERFERENCE_ENDED: {
    type: 'SIGNAL_RECOVER',
    intensity: 0.2,
    duration: 300
  },

  REALITY_SHIFT: {
    type: 'REALITY_WARP',
    intensity: 0.3,
    duration: 500
  },

  REALITY_UNSTABLE: {
    type: 'REALITY_WARP',
    intensity: 0.65,
    duration: 900
  },

  REALITY_DISTORTION: {
    type: 'DISTORTION',
    intensity: 0.7,
    duration: 800
  },

  REALITY_COLLAPSE: {
    type: 'REALITY_COLLAPSE',
    intensity: 1,
    duration: 2000
  },

  DEADSPACE_ENTERED: {
    type: 'DEADSPACE_OPEN',
    intensity: 0.9,
    duration: 1500
  },

  DEADSPACE_EXITED: {
    type: 'DEADSPACE_CLOSE',
    intensity: 0.35,
    duration: 900
  },

  DEEP_MAW_PRESENCE_SURGE: {
    type: 'DEEP_PRESENCE',
    intensity: 0.75,
    duration: 1000
  },

  DEEP_MAW_CORRUPTION: {
    type: 'REALITY_CORRUPTION',
    intensity: 0.65,
    duration: 800
  },

  DEEP_MAW_INTERFERENCE: {
    type: 'CONTROL_DISTORTION',
    intensity: 0.8,
    duration: 900
  },

  DEEP_MAW_COMMUNICATION: {
    type: 'SIGNAL_DISTORTION',
    intensity: 0.5,
    duration: 700
  },

  DEEP_MAW_REALITY: {
    type: 'REALITY_WARP',
    intensity: 0.85,
    duration: 1100
  },

  DEEP_MAW_DEADSPACE: {
    type: 'DEADSPACE_OPEN',
    intensity: 1,
    duration: 1800
  }
}

export function getVisualEffect(
  type
) {
  const effect =
    VISUAL_EFFECTS[type]

  if (!effect) {
    return null
  }

  return {
    ...effect
  }
}

export function createVisualEffect(
  type,
  data = {}
) {
  const effect =
    getVisualEffect(
      type
    )

  if (!effect) {
    return null
  }

  return {
    ...effect,

    type,
    data,

    elapsed: 0,
    active: true
  }
}

export function updateVisualEffect(
  effect,
  deltaTime
) {
  if (
    !effect ||
    !effect.active
  ) {
    return
  }

  effect.elapsed +=
    Math.max(
      0,
      Number(deltaTime) || 0
    )

  if (
    effect.elapsed >=
    effect.duration
  ) {
    effect.active = false
  }
}

export function getVisualIntensity(
  effect
) {
  if (
    !effect ||
    !effect.active
  ) {
    return 0
  }

  if (
    effect.duration <= 0
  ) {
    return 0
  }

  const progress =
    effect.elapsed /
    effect.duration

  const fade =
    Math.max(
      0,
      1 - progress
    )

  return (
    effect.intensity *
    fade
  )
}

export function isVisualEffectActive(
  effect
) {
  return Boolean(
    effect &&
    effect.active
  )
}

export function getVisualEffectTypes() {
  return Object.keys(
    VISUAL_EFFECTS
  )
}

export {
  VISUAL_EFFECTS
}