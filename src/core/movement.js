import { checkCollision } from './collision.js'

export function movePiece(
  piece,
  board,
  dx,
  dy,
  boardWidth,
  boardHeight
) {
  if (
    checkCollision(
      piece,
      board,
      boardWidth,
      boardHeight,
      dx,
      dy
    )
  ) {
    return false
  }

  piece.position.x += dx
  piece.position.y += dy

  return true
}