export function checkCollision(
  piece,
  board,
  boardWidth,
  boardHeight,
  offsetX = 0,
  offsetY = 0
) {
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
      if (!value) {
        return false
      }

      const newX = piece.position.x + x + offsetX
      const newY = piece.position.y + y + offsetY

      if (newX < 0 || newX >= boardWidth) {
        return true
      }

      if (newY >= boardHeight) {
        return true
      }

      if (newY >= 0 && board[newY][newX]) {
        return true
      }

      return false
    })
  })
}