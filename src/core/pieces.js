const PIECES = [
  {
    name: 'I',
    color: '#00ffff',
    shape: [
      [1, 1, 1, 1]
    ]
  },

  {
    name: 'O',
    color: '#ffff00',
    shape: [
      [1, 1],
      [1, 1]
    ]
  },

  {
    name: 'T',
    color: '#800080',
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },

  {
    name: 'S',
    color: '#00ff00',
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },

  {
    name: 'Z',
    color: '#c026d3',
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },

  {
    name: 'J',
    color: '#0000ff',
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },

  {
    name: 'L',
    color: '#ffa500',
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  }
]

export function createPiece(
  boardWidth,
  infected = false
) {
  const randomIndex = Math.floor(
    Math.random() * PIECES.length
  )

  const selected =
    PIECES[randomIndex]

  return {
    name: selected.name,

    color: selected.color,

    infected,

    infection: {
      level: infected ? 1 : 0,
      age: 0,
      pulse: 0,
      mutation: 0
    },

    shape:
      selected.shape.map(
        row => [...row]
      ),

    position: {
      x: Math.floor(
        (
          boardWidth -
          selected.shape[0].length
        ) / 2
      ),

      y: 0
    }
  }
}