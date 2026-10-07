const INTERFERENCE_CHANCE = 0.08

const INTERFERENCE_DURATION = 700

export function shouldInterfere() {
  return Math.random() <
    INTERFERENCE_CHANCE
}

export function createInterference() {
  return {
    active: true,
    type: 'INPUT_LOCK',
    remaining:
      INTERFERENCE_DURATION
  }
}

export function updateInterference(
  interference,
  deltaTime
) {
  if (
    !interference ||
    !interference.active
  ) {
    return
  }

  interference.remaining -=
    deltaTime

  if (
    interference.remaining <= 0
  ) {
    interference.active = false
    interference.remaining = 0
  }
}

export function isInterferenceActive(
  interference
) {
  return (
    interference &&
    interference.active
  )
}