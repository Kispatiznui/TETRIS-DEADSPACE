const listeners = new Map()

export function on(event, listener) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }

  listeners.get(event).add(listener)

  return () => {
    off(event, listener)
  }
}

export function off(event, listener) {
  const eventListeners =
    listeners.get(event)

  if (!eventListeners) {
    return
  }

  eventListeners.delete(listener)

  if (eventListeners.size === 0) {
    listeners.delete(event)
  }
}

export function emit(event, data = {}) {
  const eventListeners =
    listeners.get(event)

  if (!eventListeners) {
    return
  }

  for (const listener of eventListeners) {
    listener(data)
  }
}

export function clear(event) {
  if (
    typeof event === 'string'
  ) {
    listeners.delete(event)

    return
  }

  listeners.clear()
}