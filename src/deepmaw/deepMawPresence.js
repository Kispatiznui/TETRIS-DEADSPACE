const MAX_PRESENCE = 100

export function createDeepMawPresence() {
  return {
    value: 0,
    level: 0,
    lifetimePeak: 0,
    lastSource: null
  }
}

export function addPresence(
  presence,
  amount,
  source = 'unknown'
) {
  if (!presence) {
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

  presence.value =
    Math.min(
      MAX_PRESENCE,
      presence.value + value
    )

  presence.lifetimePeak =
    Math.max(
      presence.lifetimePeak,
      presence.value
    )

  presence.lastSource = source

  updatePresenceLevel(
    presence
  )
}

export function reducePresence(
  presence,
  amount
) {
  if (!presence) {
    return
  }

  const value =
    Math.max(
      0,
      Number(amount) || 0
    )

  presence.value =
    Math.max(
      0,
      presence.value - value
    )

  updatePresenceLevel(
    presence
  )
}

export function getPresenceLevel(
  presence
) {
  if (!presence) {
    return 0
  }

  return presence.level
}

export function getPresenceState(
  presence
) {
  if (!presence) {
    return null
  }

  return {
    value: presence.value,
    level: presence.level,
    lifetimePeak:
      presence.lifetimePeak,
    lastSource:
      presence.lastSource
  }
}

export function resetPresence(
  presence
) {
  if (!presence) {
    return
  }

  presence.value = 0
  presence.level = 0
  presence.lifetimePeak = 0
  presence.lastSource = null
}

function updatePresenceLevel(
  presence
) {
  const value =
    presence.value

  if (value >= 90) {
    presence.level = 6
    return
  }

  if (value >= 75) {
    presence.level = 5
    return
  }

  if (value >= 60) {
    presence.level = 4
    return
  }

  if (value >= 45) {
    presence.level = 3
    return
  }

  if (value >= 25) {
    presence.level = 2
    return
  }

  if (value > 0) {
    presence.level = 1
    return
  }

  presence.level = 0
}

export {
  MAX_PRESENCE
}