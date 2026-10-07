import { getAudioContext } from './audio.js'

function playTone(
  frequency,
  duration,
  type = 'square',
  volume = 0.05
) {
  const audioContext = getAudioContext()

  if (!audioContext) {
    return
  }

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency

  gainNode.gain.setValueAtTime(
    volume,
    audioContext.currentTime
  )

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  )

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.start()
  oscillator.stop(
    audioContext.currentTime + duration
  )
}

export function playMoveSound() {
  playTone(180, 0.04)
}

export function playRotateSound() {
  playTone(260, 0.06)
}

export function playLockSound() {
  playTone(100, 0.08, 'triangle')
}

export function playLineClearSound(lines) {
  const frequencies = {
    1: 440,
    2: 523.25,
    3: 659.25,
    4: 880
  }

  playTone(
    frequencies[lines] ?? 440,
    0.15,
    'square',
    0.08
  )
}

export function playGameOverSound() {
  playTone(220, 0.15, 'sawtooth', 0.06)

  setTimeout(() => {
    playTone(165, 0.2, 'sawtooth', 0.06)
  }, 120)

  setTimeout(() => {
    playTone(110, 0.3, 'sawtooth', 0.06)
  }, 280)
}