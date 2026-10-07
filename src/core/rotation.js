import { checkCollision } from './collision.js'

function rotateMatrix(matrix) {
  return matrix[0].map((_, columnIndex) => {
    return matrix
      .map(row => row[columnIndex])
      .reverse()
  })
}

export function rotatePiece(
  piece,
  board,
  boardWidth,
  boardHeight
) {
  const originalShape = piece.shape

  const rotatedShape = rotateMatrix(
    piece.shape
  )

  piece.shape = rotatedShape

  const kicks = [0, -1, 1, -2, 2]

  for (const offset of kicks) {
    if (
      !checkCollision(
        piece,
        board,
        boardWidth,
        boardHeight,
        offset,
        0
      )
    ) {
      piece.position.x += offset

      return true
    }
  }

  piece.shape = originalShape

  return false
}