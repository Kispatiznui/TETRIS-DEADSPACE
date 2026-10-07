const INFECTION_INTERVAL = 5
const PROPAGATION_INTERVAL = 5000

const INFECTED_CELL = 'INFECTED'
const CONTAINED_CELL = 'CONTAINED'

let piecesSinceInfection = 0
let propagationTimer = 0

export function resetInfection() {
  piecesSinceInfection = 0
  propagationTimer = 0
}

export function shouldInfectNextPiece() {
  piecesSinceInfection++

  if (
    piecesSinceInfection >=
    INFECTION_INTERVAL
  ) {
    piecesSinceInfection = 0

    return true
  }

  return false
}

export function updateInfection(
  board,
  deltaTime,
  createInfectedCell
) {
  propagationTimer += deltaTime

  updateInfectedCells(
    board,
    deltaTime
  )

  if (
    propagationTimer <
    PROPAGATION_INTERVAL
  ) {
    return false
  }

  propagationTimer = 0

  return propagateInfection(
    board,
    createInfectedCell
  )
}

function updateInfectedCells(
  board,
  deltaTime
) {
  const seconds =
    deltaTime / 1000

  board.forEach(
    row => {
      row.forEach(
        cell => {
          /*
           * Solo la infección ACTIVA
           * continúa creciendo.
           */

          if (
            !cell ||
            cell.type !== INFECTED_CELL
          ) {
            return
          }

          cell.age += seconds

          cell.pulse =
            (
              Math.sin(
                cell.age * 8
              ) + 1
            ) / 2

          cell.level =
            Math.min(
              3,
              1 +
              Math.floor(
                cell.age / 10
              )
            )
        }
      )
    }
  )
}

function propagateInfection(
  board,
  createInfectedCell
) {
  const infectedPositions = []

  /*
   * Buscar todas las células
   * infectadas activas.
   */

  for (
    let y = 0;
    y < board.length;
    y++
  ) {
    for (
      let x = 0;
      x < board[y].length;
      x++
    ) {
      const cell =
        board[y][x]

      if (
        cell &&
        cell.type === INFECTED_CELL
      ) {
        infectedPositions.push({
          x,
          y
        })
      }
    }
  }

  /*
   * No existe infección activa.
   */

  if (
    infectedPositions.length === 0
  ) {
    return false
  }

  const candidates = []

  infectedPositions.forEach(
    ({ x, y }) => {
      const neighbors = [
        {
          x: x - 1,
          y
        },
        {
          x: x + 1,
          y
        },
        {
          x,
          y: y - 1
        },
        {
          x,
          y: y + 1
        }
      ]

      neighbors.forEach(
        position => {
          const {
            x: neighborX,
            y: neighborY
          } = position

          /*
           * Fuera del tablero.
           */

          if (
            neighborY < 0 ||
            neighborY >= board.length ||
            neighborX < 0 ||
            neighborX >=
              board[neighborY].length
          ) {
            return
          }

          const target =
            board[neighborY][neighborX]

          /*
           * Espacio vacío:
           * no se puede infectar.
           */

          if (!target) {
            return
          }

          /*
           * Ya infectado:
           * no hacer nada.
           */

          if (
            target.type ===
            INFECTED_CELL
          ) {
            return
          }

          /*
           * Tejido contenido:
           * NO vuelve a infectarse.
           */

          if (
            target.type ===
            CONTAINED_CELL
          ) {
            return
          }

          /*
           * Todo lo que queda aquí
           * es un bloque normal.
           */

          candidates.push({
            x: neighborX,
            y: neighborY
          })
        }
      )
    }
  )

  /*
   * La infección existe, pero no tiene
   * ningún bloque normal adyacente
   * que pueda contaminar.
   */

  if (
    candidates.length === 0
  ) {
    return false
  }

  /*
   * Eliminar posiciones duplicadas.
   */

  const uniqueCandidates =
    candidates.filter(
      (candidate, index, array) => {
        return (
          array.findIndex(
            other =>
              other.x ===
                candidate.x &&
              other.y ===
                candidate.y
          ) === index
        )
      }
    )

  /*
   * La infección crece proporcionalmente
   * a su tamaño.
   */

  const amount =
    Math.min(
      uniqueCandidates.length,
      Math.max(
        1,
        Math.floor(
          infectedPositions.length / 4
        )
      )
    )

  /*
   * Infectar objetivos aleatorios.
   */

  for (
    let i = 0;
    i < amount;
    i++
  ) {
    const index =
      Math.floor(
        Math.random() *
        uniqueCandidates.length
      )

    const target =
      uniqueCandidates.splice(
        index,
        1
      )[0]

    board[target.y][target.x] =
      createInfectedCell()
  }

  /*
   * Informar al sistema de que
   * realmente ocurrió propagación.
   */

  return amount > 0
}

export function hasInfectionReachedTop(
  board
) {
  if (
    !board ||
    board.length === 0
  ) {
    return false
  }

  return board[0].some(
    cell =>
      cell &&
      cell.type === INFECTED_CELL
  )
}