import './ui/style.css'
import { createMenu } from './ui/menu.js'
import { createUI } from './ui/ui.js'
import { startGame } from './core/game.js'
import { DebugMode } from './debug/debugMode.js'

const debug =
  new DebugMode()

debug.init()

const gameUI = createUI()

createMenu(() => {
  startGame(gameUI)
})