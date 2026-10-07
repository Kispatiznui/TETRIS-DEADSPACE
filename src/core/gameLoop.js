let animationFrame = null
let lastTime = 0
let running = false

export function startGameLoop(update) {
  if (running) {
    return
  }

  running = true
  lastTime = 0

  function loop(time) {
    if (!running) {
      return
    }

    const deltaTime = lastTime === 0
      ? 0
      : time - lastTime

    lastTime = time

    update(deltaTime)

    animationFrame =
      window.requestAnimationFrame(loop)
  }

  animationFrame =
    window.requestAnimationFrame(loop)
}

export function stopGameLoop() {
  running = false

  if (animationFrame !== null) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}