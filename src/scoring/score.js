const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
}

export function calculateLineScore(linesCleared) {
  return LINE_SCORES[linesCleared] ?? 0
}

export function createScore() {
  return {
    score: 0,
    lines: 0,
    level: 1
  }
}

export function updateScore(scoreState, linesCleared) {
  if (linesCleared <= 0) {
    return
  }

  scoreState.score += calculateLineScore(linesCleared)
  scoreState.lines += linesCleared

  scoreState.level =
    Math.floor(scoreState.lines / 10) + 1
}