export function setupInput(controls) {
  function handleKeyDown(event) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        controls.moveLeft()
        break

      case 'ArrowRight':
      case 'KeyD':
        controls.moveRight()
        break

      case 'ArrowDown':
      case 'KeyS':
        controls.softDrop()
        break

      case 'ArrowUp':
      case 'KeyW':
        controls.rotate()
        break

      case 'Space':
        event.preventDefault()
        controls.hardDrop()
        break

      case 'Escape':
        controls.pause()
        break
    }
  }

  window.addEventListener(
    'keydown',
    handleKeyDown
  )

  return function removeInput() {
    window.removeEventListener(
      'keydown',
      handleKeyDown
    )
  }
}