export function createHud() {
  const hud = document.createElement('aside')

  const oxygenWarning =
    document.createElement('div')

  oxygenWarning.id =
    'oxygen-warning-overlay'

  document.body.appendChild(
    oxygenWarning
  )

  hud.id = 'hud'

  hud.innerHTML = `
    <div class="hud-header">
      <span class="hud-system">
        SYSTEM
      </span>

      <span class="hud-status">
        ACTIVE
      </span>
    </div>

    <div class="hud-line"></div>

    <section class="hud-stat hud-oxygen">
      <div class="hud-oxygen-header">
        <span class="hud-label">
          OXYGEN
        </span>

        <strong
          class="hud-oxygen-value"
          id="hud-oxygen-value"
        >
          100%
        </strong>
      </div>

      <div class="hud-oxygen-bar">
        <div
          class="hud-oxygen-fill"
          id="hud-oxygen-fill"
        ></div>
      </div>
    </section>

    <section class="hud-stat hud-score">
      <span class="hud-label">
        SCORE
      </span>

      <strong
        class="hud-value"
        id="hud-score-value"
      >
        0
      </strong>
    </section>

    <section class="hud-stat">
      <span class="hud-label">
        LINES
      </span>

      <strong
        class="hud-value"
        id="hud-lines-value"
      >
        0
      </strong>
    </section>

    <section class="hud-stat">
      <span class="hud-label">
        LEVEL
      </span>

      <strong
        class="hud-value"
        id="hud-level-value"
      >
        1
      </strong>
    </section>

    <div class="hud-line"></div>

    <div class="hud-controls">

      <span class="hud-controls-title">
        INPUT
      </span>

      <div class="hud-control">
        <span>MOVE</span>
        <strong>WASD / ARROWS</strong>
      </div>

      <div class="hud-control">
        <span>ROTATE</span>
        <strong>W / ↑</strong>
      </div>

      <div class="hud-control">
        <span>DROP</span>
        <strong>SPACE</strong>
      </div>

      <div class="hud-control">
        <span>PAUSE</span>
        <strong>ESC</strong>
      </div>

    </div>

    <div class="hud-footer">
      BUILD 01
    </div>
  `

  const oxygenValue =
    hud.querySelector('#hud-oxygen-value')

  const oxygenFill =
    hud.querySelector('#hud-oxygen-fill')

  const score =
    hud.querySelector('#hud-score-value')

  const lines =
    hud.querySelector('#hud-lines-value')

  const level =
    hud.querySelector('#hud-level-value')

  return {
    element: hud,

    update(scoreState, oxygen) {
      score.textContent =
        String(scoreState.score)
          .padStart(6, '0')

      lines.textContent =
        String(scoreState.lines)
          .padStart(2, '0')

      level.textContent =
        String(scoreState.level)
          .padStart(2, '0')

      if (oxygen) {
        const percentage =
          Math.max(
            0,
            Math.min(
              100,
              oxygen.current
            )
          )

        oxygenValue.textContent =
          `${Math.ceil(percentage)}%`

        oxygenFill.style.width =
          `${percentage}%`

        oxygenFill.classList.remove(
          'oxygen-warning',
          'oxygen-critical'
        )

        oxygenValue.classList.remove(
          'oxygen-warning',
          'oxygen-critical'
        )

        oxygenWarning.classList.remove(
          'oxygen-warning-active'
        )

        if (percentage < 30) {
          oxygenFill.classList.add(
            'oxygen-critical'
          )

          oxygenValue.classList.add(
            'oxygen-critical'
          )

          oxygenWarning.classList.add(
            'oxygen-warning-active'
          )
        } else if (percentage < 50) {
          oxygenFill.classList.add(
            'oxygen-warning'
          )

          oxygenValue.classList.add(
            'oxygen-warning'
          )
        }
      }
    }
  }
}