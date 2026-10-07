import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createBoard,
  mergePiece,
  clearLines,
  isInfectedCell,
  isContainedCell,
  createInfectedCell
} from './board.js'

import { createPiece } from './pieces.js'

import { movePiece } from './movement.js'

import { rotatePiece } from './rotation.js'

import {
  startGameLoop,
  stopGameLoop
} from './gameLoop.js'

import { setupInput } from './input.js'

import { createGameOver } from '../ui/gameOver.js'

import { createPause } from '../ui/pause.js'

import {
  createScore,
  updateScore
} from '../scoring/score.js'

import {
  BLOCK_SIZE,
  DROP_INTERVAL,
  LOCK_DELAY
} from '../config/constants.js'

import {
  createOxygen,
  consumeTime,
  consumePiece,
  recoverFromLines,
  isOxygenDepleted,
  isLowOxygen
} from '../survival/oxygen.js'

import {
  resetInfection,
  shouldInfectNextPiece,
  updateInfection,
  hasInfectionReachedTop
} from '../infection/infection.js'

import {
  AIDirector,
  AI_EVENTS
} from '../ai/aiDirector.js'

import {
  createReality,
  getRealityState,
  resetReality
} from '../reality/reality.js'

import {
  createDeadspace,
  updateDeadspace,
  getDeadspaceState,
  resetDeadspace
} from '../reality/deadspace.js'

import {
  DeepMawDirector
} from '../deepmaw/deepMawDirector.js'

import {
  GAME_EVENTS
} from './events.js'

import {
  emit
} from './eventBus.js'

const canvas =
  document.querySelector('#game-canvas')

const context =
  canvas.getContext('2d')

const aiDirector =
  new AIDirector()

const deepMawDirector =
  new DeepMawDirector()

canvas.width =
  BOARD_WIDTH * BLOCK_SIZE

canvas.height =
  BOARD_HEIGHT * BLOCK_SIZE

context.scale(
  BLOCK_SIZE,
  BLOCK_SIZE
)

let board
let currentPiece
let nextPiece

let scoreState
let oxygen

let reality
let deadspace

let gameUI = null

let dropTimer = 0
let lockTimer = 0

let infectionPulse = 0

let isLocking = false
let gameOver = false
let paused = false

let oxygenWasLow = false

let removeInput = null
let gameOverOverlay = null
let pauseOverlay = null

export function startGame(ui) {
  stopGameLoop()

  gameUI = ui

  if (removeInput) {
    removeInput()
    removeInput = null
  }

  if (gameOverOverlay) {
    gameOverOverlay.remove()
    gameOverOverlay = null
  }

  if (pauseOverlay) {
    pauseOverlay.remove()
    pauseOverlay = null
  }

  board =
    createBoard()

  scoreState =
    createScore()

  oxygen =
    createOxygen()

  reality =
    createReality()

  deadspace =
    createDeadspace()

  resetInfection()

  resetReality(
    reality
  )

  resetDeadspace(
    deadspace
  )

  deepMawDirector.reset()

  dropTimer = 0
  lockTimer = 0
  infectionPulse = 0

  isLocking = false
  gameOver = false
  paused = false
  oxygenWasLow = false

  currentPiece =
    createPiece(
      BOARD_WIDTH
    )

  nextPiece =
    createPiece(
      BOARD_WIDTH
    )

  aiDirector.reset()
  aiDirector.init()

  currentPiece =
    aiDirector.corrupt(
      currentPiece
    )

  aiDirector.observe(
    AI_EVENTS.PIECE_SPAWNED,
    {
      piece:
        currentPiece.name,

      infected:
        currentPiece.infected,

      corrupted:
        currentPiece.corruption?.active === true
    }
  )

  emit(
    GAME_EVENTS.GAME_STARTED,
    {
      oxygen:
        oxygen.current,

      reality:
        getRealityState(
          reality
        )
    }
  )

  removeInput =
    setupInput({
      moveLeft,
      moveRight,
      softDrop,
      rotate,
      hardDrop,
      pause
    })

  updateUI()

  draw()

  startGameLoop(update)
}

function update(deltaTime) {
  if (gameOver || paused) {
    return
  }

  if (gameUI) {
  gameUI.update(
    deltaTime
  )
  }
  /*
   * =========================
   * AI
   * =========================
   */

  aiDirector.updateInterference(
    deltaTime
  )

  /*
   * =========================
   * OXYGEN
   * =========================
   */

  consumeTime(
    oxygen,
    deltaTime
  )

  const oxygenLow =
    isLowOxygen(
      oxygen
    )

  if (
    oxygenLow &&
    !oxygenWasLow
  ) {
    aiDirector.observe(
      AI_EVENTS.OXYGEN_LOW,
      {
        oxygen:
          oxygen.current
      }
    )

    emit(
      GAME_EVENTS.OXYGEN_LOW,
      {
        oxygen:
          oxygen.current
      }
    )
  }

  oxygenWasLow =
    oxygenLow

  /*
   * =========================
   * REALITY / DEADSPACE
   * =========================
   */

  updateReality(
    deltaTime
  )

  /*
   * =========================
   * DEEP MAW
   * =========================
   *
   * THE DEEP MAW observes the
   * current reality and can
   * progressively destabilize it.
   */

  deepMawDirector.update(
    deltaTime,
    reality
  )

  /*
   * =========================
   * INFECTION
   * =========================
   */

  infectionPulse +=
    deltaTime / 1000

  const infectionPropagated =
    updateInfection(
      board,
      deltaTime,
      createInfectedCell
    )

  if (
    infectionPropagated
  ) {
    const infectedCells =
      countInfectedCells()

    aiDirector.observe(
      AI_EVENTS.INFECTION_PROPAGATED,
      {
        infectedCells
      }
    )

    emit(
      GAME_EVENTS.INFECTION_PROPAGATED,
      {
        infectedCells
      }
    )
  }

  if (
    hasInfectionReachedTop(
      board
    )
  ) {
    const infectedCells =
      countInfectedCells()

    emit(
      GAME_EVENTS.INFECTION_REACHED_TOP,
      {
        infectedCells
      }
    )

    endGame(
      'CONTENCIÓN FALLIDA'
    )

    return
  }

  /*
   * =========================
   * OXYGEN DEPLETION
   * =========================
   */

  if (
    isOxygenDepleted(
      oxygen
    )
  ) {
    aiDirector.observe(
      AI_EVENTS.OXYGEN_DEPLETED,
      {
        oxygen: 0
      }
    )

    emit(
      GAME_EVENTS.OXYGEN_DEPLETED,
      {
        oxygen: 0
      }
    )

    endGame(
      'ASFIXIA'
    )

    return
  }

  /*
   * =========================
   * LOCK DELAY
   * =========================
   */

  if (isLocking) {
    lockTimer += deltaTime

    if (
      lockTimer >=
      LOCK_DELAY
    ) {
      lockPiece()
    }

    draw()

    return
  }

  /*
   * =========================
   * AUTOMATIC DROP
   * =========================
   */

  dropTimer += deltaTime

  if (
    dropTimer >=
    DROP_INTERVAL
  ) {
    dropTimer = 0

    const movedDown =
      movePiece(
        currentPiece,
        board,
        0,
        1,
        BOARD_WIDTH,
        BOARD_HEIGHT
      )

    if (!movedDown) {
      startLockDelay()
    }
  }

  draw()
}

function updateReality(
  deltaTime
) {
  updateDeadspace(
    deadspace,
    reality,
    deltaTime
  )
}

function startLockDelay() {
  isLocking = true

  lockTimer = 0
}

function resetLockDelay() {
  if (!isLocking) {
    return
  }

  lockTimer = 0
}

function moveLeft() {
  if (gameOver || paused) {
    return
  }

  if (
    aiDirector.isInterferenceActive()
  ) {
    return
  }

  const moved =
    movePiece(
      currentPiece,
      board,
      -1,
      0,
      BOARD_WIDTH,
      BOARD_HEIGHT
    )

  if (moved) {
    resetLockDelay()

    aiDirector.observe(
      AI_EVENTS.PIECE_MOVED,
      {
        direction: 'LEFT'
      }
    )

    emit(
      GAME_EVENTS.PIECE_MOVED,
      {
        direction: 'LEFT'
      }
    )
  }

  draw()
}

function moveRight() {
  if (gameOver || paused) {
    return
  }

  if (
    aiDirector.isInterferenceActive()
  ) {
    return
  }

  const moved =
    movePiece(
      currentPiece,
      board,
      1,
      0,
      BOARD_WIDTH,
      BOARD_HEIGHT
    )

  if (moved) {
    resetLockDelay()

    aiDirector.observe(
      AI_EVENTS.PIECE_MOVED,
      {
        direction: 'RIGHT'
      }
    )

    emit(
      GAME_EVENTS.PIECE_MOVED,
      {
        direction: 'RIGHT'
      }
    )
  }

  draw()
}

function softDrop() {
  if (gameOver || paused) {
    return
  }

  const moved =
    movePiece(
      currentPiece,
      board,
      0,
      1,
      BOARD_WIDTH,
      BOARD_HEIGHT
    )

  if (!moved) {
    startLockDelay()
  } else {
    dropTimer = 0

    aiDirector.observe(
      AI_EVENTS.PIECE_MOVED,
      {
        direction: 'DOWN'
      }
    )

    emit(
      GAME_EVENTS.PIECE_MOVED,
      {
        direction: 'DOWN'
      }
    )
  }

  draw()
}

function rotate() {
  if (gameOver || paused) {
    return
  }

  if (
    aiDirector.isInterferenceActive()
  ) {
    return
  }

  const rotated =
    rotatePiece(
      currentPiece,
      board,
      BOARD_WIDTH,
      BOARD_HEIGHT
    )

  if (rotated) {
    resetLockDelay()

    aiDirector.observe(
      AI_EVENTS.PIECE_ROTATED,
      {
        piece:
          currentPiece.name
      }
    )

    emit(
      GAME_EVENTS.PIECE_ROTATED,
      {
        piece:
          currentPiece.name
      }
    )
  }

  draw()
}

function hardDrop() {
  if (gameOver || paused) {
    return
  }

  while (
    movePiece(
      currentPiece,
      board,
      0,
      1,
      BOARD_WIDTH,
      BOARD_HEIGHT
    )
  ) {
    // Continúa hasta llegar al suelo.
  }

  lockPiece()

  draw()
}

function pause() {
  if (gameOver) {
    return
  }

  paused = !paused

  if (paused) {
    stopGameLoop()

    emit(
      GAME_EVENTS.GAME_PAUSED
    )

    pauseOverlay =
      createPause({
        onResume: resumeGame,
        onRestart: restartGame,
        onReturn: returnToMenu
      })

    return
  }

  resumeGame()
}

function resumeGame() {
  if (!paused || gameOver) {
    return
  }

  paused = false

  if (pauseOverlay) {
    pauseOverlay.remove()
    pauseOverlay = null
  }

  emit(
    GAME_EVENTS.GAME_RESUMED
  )

  startGameLoop(update)

  draw()
}

function restartGame() {
  if (pauseOverlay) {
    pauseOverlay.remove()
    pauseOverlay = null
  }

  startGame(gameUI)
}

function returnToMenu() {
  if (pauseOverlay) {
    pauseOverlay.remove()
    pauseOverlay = null
  }

  if (removeInput) {
    removeInput()
    removeInput = null
  }

  stopGameLoop()

  window.location.reload()
}

function lockPiece() {
  aiDirector.observe(
    AI_EVENTS.PIECE_LOCKED,
    {
      piece:
        currentPiece.name,

      infected:
        currentPiece.infected,

      corrupted:
        currentPiece.corruption?.active === true
    }
  )

  mergePiece(
    board,
    currentPiece
  )

  emit(
    GAME_EVENTS.PIECE_LOCKED,
    {
      piece:
        currentPiece.name,

      infected:
        currentPiece.infected,

      corrupted:
        currentPiece.corruption?.active === true
    }
  )

  consumePiece(
    oxygen
  )

  const lineResult =
    clearLines(board)

  const clearedLines =
    lineResult.clearedLines

  const containedLines =
    lineResult.containedLines

  updateScore(
    scoreState,
    clearedLines
  )

  recoverFromLines(
    oxygen,
    clearedLines
  )

  if (
    clearedLines > 0
  ) {
    aiDirector.observe(
      AI_EVENTS.LINE_CLEARED,
      {
        lines:
          clearedLines
      }
    )

    emit(
      GAME_EVENTS.LINE_CLEARED,
      {
        lines:
          clearedLines
      }
    )
  }

  if (
    containedLines > 0
  ) {
    console.log(
      `[INFECTION] ${containedLines} line(s) contained.`
    )

    emit(
      GAME_EVENTS.INFECTION_CONTAINED,
      {
        lines:
          containedLines
      }
    )
  }

  if (
    currentPiece.infected
  ) {
    aiDirector.observe(
      AI_EVENTS.INFECTION_CREATED,
      {
        piece:
          currentPiece.name
      }
    )

    emit(
      GAME_EVENTS.INFECTION_CREATED,
      {
        piece:
          currentPiece.name
      }
    )
  }

  currentPiece =
    nextPiece

  currentPiece =
    aiDirector.corrupt(
      currentPiece
    )

  if (
    currentPiece.corruption?.active
  ) {
    emit(
      GAME_EVENTS.PIECE_CORRUPTED,
      {
        piece:
          currentPiece.name
      }
    )
  }

  const infected =
    shouldInfectNextPiece()

  nextPiece =
    createPiece(
      BOARD_WIDTH,
      infected
    )

  aiDirector.observe(
    AI_EVENTS.PIECE_SPAWNED,
    {
      piece:
        currentPiece.name,

      infected:
        currentPiece.infected,

      corrupted:
        currentPiece.corruption?.active === true
    }
  )

  emit(
    GAME_EVENTS.PIECE_SPAWNED,
    {
      piece:
        currentPiece.name,

      infected:
        currentPiece.infected,

      corrupted:
        currentPiece.corruption?.active === true
    }
  )

  /*
   * La IA puede intentar interferir
   * después de cada nueva pieza.
   *
   * Si se activa, AIDirector emite
   * AI_INTERFERENCE_STARTED.
   */

  aiDirector.triggerInterference()

  dropTimer = 0
  lockTimer = 0

  isLocking = false

  updateUI()

  if (
    checkPieceCollision(
      currentPiece
    )
  ) {
    registerPlayerError(
      15,
      'spawn-collision'
    )

    endGame(
      'ASFIXIA'
    )
  }
}

function registerPlayerError(
  magnitude,
  source
) {
  const value =
    Math.max(
      0,
      Number(magnitude) || 0
    )

  if (value === 0) {
    return
  }

  const data = {
    magnitude: value,
    source
  }

  aiDirector.observe(
    AI_EVENTS.PLAYER_MISTAKE,
    data
  )

  emit(
    GAME_EVENTS.PLAYER_ERROR,
    data
  )
}

function updateUI() {
  if (!gameUI) {
    return
  }

  gameUI.updateScore(
    scoreState,
    oxygen
  )

  gameUI.updateNextPiece(
    nextPiece
  )
}

function endGame(
  reason = 'ASFIXIA'
) {
  if (gameOver) {
    return
  }

  gameOver = true
  paused = false

  aiDirector.observe(
    AI_EVENTS.GAME_OVER,
    {
      reason
    }
  )

  emit(
    GAME_EVENTS.GAME_OVER,
    {
      reason
    }
  )

  stopGameLoop()

  if (pauseOverlay) {
    pauseOverlay.remove()
    pauseOverlay = null
  }

  if (removeInput) {
    removeInput()
    removeInput = null
  }

  gameOverOverlay =
    createGameOver(
      scoreState.score,
      startGameWithUI,
      reason
    )

  draw()
}

function startGameWithUI() {
  startGame(gameUI)
}

function checkPieceCollision(piece) {
  return piece.shape.some(
    (row, y) => {
      return row.some(
        (value, x) => {
          if (!value) {
            return false
          }

          const boardX =
            piece.position.x + x

          const boardY =
            piece.position.y + y

          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH
          ) {
            return true
          }

          if (
            boardY < 0 ||
            boardY >= BOARD_HEIGHT
          ) {
            return true
          }

          return (
            board[boardY][boardX] !== 0
          )
        }
      )
    }
  )
}

function countInfectedCells() {
  let count = 0

  board.forEach(
    row => {
      row.forEach(
        cell => {
          if (
            isInfectedCell(cell)
          ) {
            count++
          }
        }
      )
    }
  )

  return count
}

function draw() {
  context.fillStyle =
    '#08080c'

  context.fillRect(
    0,
    0,
    BOARD_WIDTH,
    BOARD_HEIGHT
  )

  drawGrid()

  drawBoard()

  if (currentPiece) {
    drawPiece()
  }
}

function drawGrid() {
  context.strokeStyle =
    '#30243f'

  context.lineWidth =
    0.08

  for (
    let x = 0;
    x <= BOARD_WIDTH;
    x++
  ) {
    context.beginPath()

    context.moveTo(
      x,
      0
    )

    context.lineTo(
      x,
      BOARD_HEIGHT
    )

    context.stroke()
  }

  for (
    let y = 0;
    y <= BOARD_HEIGHT;
    y++
  ) {
    context.beginPath()

    context.moveTo(
      0,
      y
    )

    context.lineTo(
      BOARD_WIDTH,
      y
    )

    context.stroke()
  }
}

function drawBoard() {
  board.forEach(
    (row, y) => {
      row.forEach(
        (cell, x) => {
          if (!cell) {
            return
          }

          if (
            isInfectedCell(cell)
          ) {
            drawInfectedCell(
              cell,
              x,
              y
            )

            return
          }

          if (
            isContainedCell(cell)
          ) {
            drawContainedCell(
              cell,
              x,
              y
            )

            return
          }

          context.fillStyle =
            cell

          context.fillRect(
            x,
            y,
            1,
            1
          )
        }
      )
    }
  )
}

function drawInfectedCell(
  cell,
  x,
  y
) {
  const pulse =
    cell.pulse || 0

  const level =
    cell.level || 1

  const padding =
    0.08 -
    pulse * 0.025

  context.fillStyle =
    '#170308'

  context.fillRect(
    x,
    y,
    1,
    1
  )

  context.strokeStyle =
    level >= 3
      ? '#ff2020'
      : '#8b0000'

  context.lineWidth =
    0.12 +
    pulse * 0.08

  context.strokeRect(
    x + padding,
    y + padding,
    1 - padding * 2,
    1 - padding * 2
  )

  if (
    level >= 2
  ) {
    context.strokeStyle =
      '#5c0000'

    context.lineWidth =
      0.04

    context.beginPath()

    context.moveTo(
      x + 0.2,
      y + 0.2
    )

    context.lineTo(
      x + 0.8,
      y + 0.8
    )

    context.moveTo(
      x + 0.8,
      y + 0.2
    )

    context.lineTo(
      x + 0.2,
      y + 0.8
    )

    context.stroke()
  }
}

function drawContainedCell(
  cell,
  x,
  y
) {
  const level =
    cell.level || 1

  context.fillStyle =
    '#08080c'

  context.fillRect(
    x,
    y,
    1,
    1
  )

  context.strokeStyle =
    '#4a4a4a'

  context.lineWidth =
    0.12

  context.strokeRect(
    x + 0.08,
    y + 0.08,
    0.84,
    0.84
  )

  context.strokeStyle =
    level >= 3
      ? '#8b0000'
      : '#3a1a1a'

  context.lineWidth =
    0.05

  context.beginPath()

  context.moveTo(
    x + 0.15,
    y + 0.25
  )

  context.lineTo(
    x + 0.85,
    y + 0.7
  )

  context.moveTo(
    x + 0.75,
    y + 0.15
  )

  context.lineTo(
    x + 0.25,
    y + 0.85
  )

  context.stroke()
}

function drawPiece() {
  currentPiece.shape.forEach(
    (row, y) => {
      row.forEach(
        (value, x) => {
          if (!value) {
            return
          }

          const drawX =
            x + currentPiece.position.x

          const drawY =
            y + currentPiece.position.y

          const padding = 0.08

          context.fillStyle =
            '#08080c'

          context.fillRect(
            drawX,
            drawY,
            1,
            1
          )

          const pulse =
            currentPiece.infected
              ? Math.sin(
                  infectionPulse * 8
                ) * 0.05
              : 0

          context.strokeStyle =
            currentPiece.infected
              ? '#8b0000'
              : currentPiece.color

          context.lineWidth =
            currentPiece.infected
              ? 0.18 + pulse
              : 0.12

          context.strokeRect(
            drawX + padding,
            drawY + padding,
            1 - padding * 2,
            1 - padding * 2
          )
        }
      )
    }
  )
}

/*
 * =========================
 * DEBUG API
 * =========================
 */

export function getDebugState() {
  return {
    gameOver,
    paused,

    oxygen:
      oxygen
        ? oxygen.current
        : null,

    score:
      scoreState
        ? scoreState.score
        : null,

    lines:
      scoreState
        ? scoreState.lines
        : null,

    level:
      scoreState
        ? scoreState.level
        : null,

    currentPiece:
      currentPiece
        ? currentPiece.name
        : null,

    nextPiece:
      nextPiece
        ? nextPiece.name
        : null,

    currentPieceCorrupted:
      currentPiece
        ? currentPiece.corruption?.active === true
        : false,

    currentPieceInfected:
      currentPiece
        ? currentPiece.infected
        : false,

    reality:
      getRealityState(
        reality
      ),

    deadspace:
      getDeadspaceState(
        deadspace
      ),

    ai:
      aiDirector.getState(),

    deepMaw:
      deepMawDirector.getState()
  }
}

export function debugSetOxygen(value) {
  if (!oxygen) {
    return false
  }

  oxygen.current =
    Math.max(
      0,
      Math.min(
        oxygen.max,
        value
      )
    )

  oxygenWasLow =
    isLowOxygen(
      oxygen
    )

  updateUI()
  draw()

  return true
}