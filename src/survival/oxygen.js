const MAX_OXYGEN = 100

const PASSIVE_DRAIN = 0.8
const PIECE_DRAIN = 1.5

const LINE_RECOVERY = {
  1: 8,
  2: 16,
  3: 35,
  4: 50
}

const LOW_OXYGEN_THRESHOLD = 30

export function createOxygen() {
  return {
    current: MAX_OXYGEN,
    max: MAX_OXYGEN
  }
}

export function consumeTime(oxygen, deltaTime) {
  if (oxygen.current <= 0) {
    return
  }

  const seconds =
    deltaTime / 1000

  const multiplier =
    oxygen.current < LOW_OXYGEN_THRESHOLD
      ? 2
      : 1

  const amount =
    PASSIVE_DRAIN *
    seconds *
    multiplier

  oxygen.current =
    Math.max(
      0,
      oxygen.current - amount
    )
}

export function consumePiece(oxygen) {
  oxygen.current =
    Math.max(
      0,
      oxygen.current - PIECE_DRAIN
    )
}

export function recoverFromLines(
  oxygen,
  linesCleared
) {
  const recovery =
    LINE_RECOVERY[linesCleared] ?? 0

  oxygen.current =
    Math.min(
      oxygen.max,
      oxygen.current + recovery
    )
}

export function isOxygenDepleted(oxygen) {
  return oxygen.current <= 0
}

export function isLowOxygen(oxygen) {
  return (
    oxygen.current > 0 &&
    oxygen.current < LOW_OXYGEN_THRESHOLD
  )
}