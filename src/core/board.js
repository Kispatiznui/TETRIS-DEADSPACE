const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

const INFECTED_CELL = 'INFECTED'
const CONTAINED_CELL = 'CONTAINED'

export function createBoard() {
  return Array.from(
    { length: BOARD_HEIGHT },
    () => Array(BOARD_WIDTH).fill(0)
  )
}

export function createInfectedCell() {
  return {
    type: INFECTED_CELL,
    age: 0,
    pulse: 0,
    level: 1
  }
}

export function createContainedCell(
  infectedCell
) {
  return {
    type: CONTAINED_CELL,
    age: infectedCell.age || 0,
    pulse: 0,
    level: infectedCell.level || 1
  }
}

export function mergePiece(
  board,
  piece
) {
  piece.shape.forEach(
    (row, y) => {
      row.forEach(
        (value, x) => {
          if (!value) {
            return
          }

          const boardX =
            piece.position.x + x

          const boardY =
            piece.position.y + y

          if (
            boardY >= 0 &&
            boardY < BOARD_HEIGHT &&
            boardX >= 0 &&
            boardX < BOARD_WIDTH
          ) {
            board[boardY][boardX] =
              piece.infected
                ? createInfectedCell()
                : piece.color
          }
        }
      )
    }
  )
}

export function clearLines(board) {
  let clearedLines = 0
  let containedLines = 0

  const rowsToRemove = []
  const containedCells = []

  /*
   * =================================
   * IDENTIFICAR FILAS COMPLETAS
   * =================================
   */

  for (
    let y = 0;
    y < BOARD_HEIGHT;
    y++
  ) {
    const row = board[y]

    const isFull =
      row.every(
        cell => cell !== 0
      )

    if (!isFull) {
      continue
    }

    const infectedInRow =
      row.filter(
        cell =>
          isInfectedCell(cell)
      )

    if (
      infectedInRow.length > 0
    ) {
      /*
       * Guardamos los infectados como
       * entidades independientes.
       *
       * La fila completa sí será eliminada.
       */

      row.forEach(
        (cell, x) => {
          if (
            isInfectedCell(cell)
          ) {
            containedCells.push({
              x,
              cell:
                createContainedCell(
                  cell
                )
            })
          }
        }
      )

      containedLines++

      rowsToRemove.push(y)

      continue
    }

    /*
     * Línea completamente normal.
     */

    clearedLines++

    rowsToRemove.push(y)
  }

  /*
   * =================================
   * ELIMINAR LAS FILAS
   * =================================
   */

  const rowsToKeep =
    board.filter(
      (_, y) =>
        !rowsToRemove.includes(y)
    )

  /*
   * =================================
   * COMPACTAR EL TABLERO
   * =================================
   *
   * Aquí ocurre el descenso real.
   */

  while (
    rowsToKeep.length <
    BOARD_HEIGHT
  ) {
    rowsToKeep.unshift(
      Array(
        BOARD_WIDTH
      ).fill(0)
    )
  }

  /*
   * =================================
   * RESTAURAR LOS CONTAINED
   * =================================
   *
   * Los contaminados sobreviven,
   * pero ya no pertenecen a la
   * fila eliminada.
   *
   * Los colocamos en la parte inferior
   * de su respectiva columna.
   */

  containedCells.forEach(
    ({ x, cell }) => {
      for (
        let y = BOARD_HEIGHT - 1;
        y >= 0;
        y--
      ) {
        if (
          rowsToKeep[y][x] === 0
        ) {
          rowsToKeep[y][x] = cell

          break
        }
      }
    }
  )

  /*
   * =================================
   * ACTUALIZAR TABLERO
   * =================================
   */

  board.length = 0

  rowsToKeep.forEach(
    row => {
      board.push(row)
    }
  )

  return {
    clearedLines,
    containedLines
  }
}

export function isInfectedCell(
  cell
) {
  return (
    cell &&
    cell.type === INFECTED_CELL
  )
}

export function isContainedCell(
  cell
) {
  return (
    cell &&
    cell.type === CONTAINED_CELL
  )
}

export {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  INFECTED_CELL,
  CONTAINED_CELL
}