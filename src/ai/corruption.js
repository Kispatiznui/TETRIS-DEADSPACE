const CORRUPTION_CHANCE = 0.15

export function shouldCorruptPiece() {
  return Math.random() <
    CORRUPTION_CHANCE
}

export function corruptPiece(piece) {
  if (!piece) {
    return null
  }

  const corruptedPiece = {
    ...piece,

    shape:
      piece.shape.map(
        row => [...row]
      ),

    corruption: {
      active: true,
      type: 'SHAPE_MUTATION'
    }
  }

  mutateShape(
    corruptedPiece
  )

  return corruptedPiece
}

function mutateShape(piece) {
  const shape =
    piece.shape

  if (
    shape.length === 0 ||
    shape[0].length === 0
  ) {
    return
  }

  const height =
    shape.length

  const width =
    shape[0].length

  const cells = []

  for (
    let y = 0;
    y < height;
    y++
  ) {
    for (
      let x = 0;
      x < width;
      x++
    ) {
      if (shape[y][x]) {
        cells.push({
          x,
          y
        })
      }
    }
  }

  if (cells.length < 2) {
    return
  }

  const source =
    cells[
      Math.floor(
        Math.random() *
        cells.length
      )
    ]

  const directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ]

  const direction =
    directions[
      Math.floor(
        Math.random() *
        directions.length
      )
    ]

  const targetX =
    source.x +
    direction.x

  const targetY =
    source.y +
    direction.y

  if (
    targetY < 0 ||
    targetY >= height ||
    targetX < 0 ||
    targetX >= width
  ) {
    return
  }

  if (
    shape[targetY][targetX]
  ) {
    return
  }

  shape[targetY][targetX] = 1
}