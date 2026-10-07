export function createPause({
  onResume,
  onRestart,
  onReturn
}) {
  const overlay =
    document.createElement('section')

  overlay.id = 'pause-menu'

  overlay.innerHTML = `
    <div class="pause-atmosphere"></div>

    <div class="pause-grid"></div>

    <div class="pause-content">

      <div class="pause-system">
        TETRIS: DEADSPACE // SYSTEM
      </div>

      <div class="pause-title">
        <span>GAME</span>
        PAUSED
      </div>

      <div class="pause-line"></div>

      <div class="pause-subtitle">
        TEMPORAL EXECUTION SUSPENDED
      </div>

      <div class="pause-options">

        <button
          type="button"
          class="pause-button primary"
          id="resume-button"
        >
          RESUME
        </button>

        <button
          type="button"
          class="pause-button"
          id="restart-button"
        >
          RESTART
        </button>

        <button
          type="button"
          class="pause-button"
          id="return-menu-button"
        >
          RETURN TO MENU
        </button>

      </div>

      <div class="pause-footer">
        ESC // RESUME
      </div>

    </div>
  `

  const resumeButton =
    overlay.querySelector(
      '#resume-button'
    )

  const restartButton =
    overlay.querySelector(
      '#restart-button'
    )

  const returnButton =
    overlay.querySelector(
      '#return-menu-button'
    )

  resumeButton.addEventListener(
    'click',
    event => {
      event.preventDefault()
      event.stopPropagation()

      onResume()
    }
  )

  restartButton.addEventListener(
    'click',
    event => {
      event.preventDefault()
      event.stopPropagation()

      onRestart()
    }
  )

  returnButton.addEventListener(
    'click',
    event => {
      event.preventDefault()
      event.stopPropagation()

      onReturn()
    }
  )

  document
    .querySelector('#app')
    .appendChild(overlay)

  return overlay
}