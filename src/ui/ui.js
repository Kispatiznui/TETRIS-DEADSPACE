import {
  createHud
} from './hud.js'

import {
  createNextPiece
} from './nextPiece.js'

import {
  createFeedback
} from './feedback.js'

import {
  FeedbackDirector
} from '../feedback/feedbackDirector.js'

let hud
let nextPiece
let feedback
let feedbackDirector

export function createUI() {
  const layout =
    document.createElement('div')

  layout.id =
    'tetris-layout'

  const boardContainer =
    document.querySelector('#game')

  hud =
    createHud()

  nextPiece =
    createNextPiece()

  feedback =
    createFeedback()

  feedbackDirector =
    new FeedbackDirector()

  layout.append(
    hud.element,
    boardContainer,
    nextPiece.element
  )

  document
    .querySelector('#app')
    .appendChild(layout)

  return {
    updateScore(
      scoreState,
      oxygen
    ) {
      if (!hud) {
        return
      }

      hud.update(
        scoreState,
        oxygen
      )
    },

    updateNextPiece(piece) {
      if (
        !nextPiece ||
        !piece
      ) {
        return
      }

      nextPiece.update(
        piece
      )
    },

    update(deltaTime) {
      if (
        feedbackDirector
      ) {
        feedbackDirector.update(
          deltaTime
        )
      }

      if (feedback) {
        feedback.update(
          deltaTime
        )
      }
    },

    destroy() {
      if (
        feedbackDirector
      ) {
        feedbackDirector.destroy()
        feedbackDirector = null
      }

      if (feedback) {
        feedback.destroy()
        feedback = null
      }

      hud = null
      nextPiece = null
    }
  }
}