export function createGameOver(
  score,
  onRestart,
  reason = 'ASFIXIA'
) {
  const overlay = document.createElement('section')

  overlay.id = 'game-over'

  overlay.innerHTML = `
    <div class="deadspace-overlay-atmosphere"></div>

    <div class="deadspace-overlay-grid"></div>

    <div class="deadspace-overlay-content">

      <div class="overlay-system">
        TETRIS: DEADSPACE // SYSTEM
      </div>

      <div class="overlay-title">
        SYSTEM
        <span>TERMINATED</span>
      </div>

      <div class="overlay-line"></div>

      <div class="overlay-subtitle">
        ${reason}
      </div>

      <div class="game-over-stats">

        <div class="game-over-stat">
          <span>SCORE</span>
          <strong>${score}</strong>
        </div>

        <div class="game-over-stat">
          <span>STATUS</span>
          <strong>FAILED</strong>
        </div>

      </div>

      <div class="overlay-options">

        <button
          class="deadspace-button primary"
          id="restart-button"
        >
          TRY AGAIN
        </button>

        <button
          class="deadspace-button"
          id="return-button"
        >
          RETURN
        </button>

      </div>

      <div class="overlay-footer">
        CONNECTION LOST // BUILD 01
      </div>

    </div>
  `

  const restartButton =
    overlay.querySelector('#restart-button')

  restartButton.addEventListener('click', () => {
    overlay.classList.add('overlay-exit')

    setTimeout(() => {
      overlay.remove()
      onRestart()
    }, 400)
  })

  const returnButton =
    overlay.querySelector('#return-button')

  returnButton.addEventListener('click', () => {
    overlay.classList.add('overlay-exit')

    setTimeout(() => {
      overlay.remove()
      window.location.reload()
    }, 400)
  })

  document
    .querySelector('#app')
    .appendChild(overlay)

  return overlay
}