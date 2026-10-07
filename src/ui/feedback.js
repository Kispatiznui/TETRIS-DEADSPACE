import {
  on
} from '../core/eventBus.js'

import {
  FEEDBACK_EVENTS
} from '../feedback/feedbackDirector.js'

export function createFeedback() {
  const container =
    document.createElement('div')

  container.id =
    'feedback-layer'

  container.innerHTML = `
    <div
      id="feedback-message"
      class="feedback-message"
    >
      <span
        id="feedback-message-text"
        class="feedback-message-text"
      ></span>
    </div>

    <div
      id="feedback-signal"
      class="feedback-signal"
    ></div>
  `

  document.body.appendChild(
    container
  )

  const message =
    container.querySelector(
      '#feedback-message'
    )

  const messageText =
    container.querySelector(
      '#feedback-message-text'
    )

  const signal =
    container.querySelector(
      '#feedback-signal'
    )

  let messageTimeout = null

  const removeMessage =
    on(
      FEEDBACK_EVENTS.MESSAGE,
      data => {
        if (
          !data ||
          !data.text
        ) {
          hideMessage()
          return
        }

        showMessage(
          data.text,
          data.priority
        )
      }
    )

  const removeVisual =
    on(
      FEEDBACK_EVENTS.VISUAL,
      data => {
        if (!data) {
          return
        }

        triggerVisual(
          data
        )
      }
    )

  function showMessage(
    text,
    priority = 'normal'
  ) {
    if (messageTimeout) {
      clearTimeout(
        messageTimeout
      )
    }

    messageText.textContent =
      text

    message.className =
      'feedback-message'

    message.classList.add(
      `feedback-${priority}`
    )

    message.classList.add(
      'feedback-message-visible'
    )

    messageTimeout =
      setTimeout(
        hideMessage,
        2600
      )
  }

  function hideMessage() {
    message.classList.remove(
      'feedback-message-visible'
    )
  }

  function triggerVisual(
    data
  ) {
    const type =
      data.type ||
      'default'

    const intensity =
      Number(
        data.intensity
      ) || 1

    const duration =
      Number(
        data.duration
      ) || 500

    signal.className =
      'feedback-signal'

    signal.classList.add(
      `feedback-${type}`
    )

    signal.style.setProperty(
      '--feedback-intensity',
      Math.min(
        1,
        Math.max(
          0,
          intensity
        )
      )
    )

    signal.classList.add(
      'feedback-signal-active'
    )

    window.setTimeout(
      () => {
        signal.classList.remove(
          'feedback-signal-active'
        )
      },
      duration
    )
  }

  function destroy() {
    if (messageTimeout) {
      clearTimeout(
        messageTimeout
      )
    }

    removeMessage()
    removeVisual()

    container.remove()
  }

  return {
    element:
      container,

    update() {
      // El feedback visual se
      // controla por eventos.
    },

    destroy
  }
}