import { getAudioContext } from './audio.js'

let musicTimer = null
let isPlaying = false

const melody = [
  261.63,
  329.63,
  392.00,
  523.25,
  392.00,
  329.63,
  261.63,
  196.00
]

function playNote(frequency, duration) {
  const audioContext = getAudioContext()

  if (!audioContext) {
    return
  }

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = 'square'
  oscillator.frequency.value = frequency

  gainNode.gain.setValueAtTime(
    0.02,
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

function playMelody() {
  if (!isPlaying) {
    return
  }

  let index = 0

  musicTimer = setInterval(() => {
    playNote(
      melody[index],
      0.18
    )

    index = (index + 1) % melody.length
  }, 220)
}

export function startMusic() {
  if (isPlaying) {
    return
  }

  isPlaying = true

  playMelody()
}

export function stopMusic() {
  isPlaying = false

  if (musicTimer) {
    clearInterval(musicTimer)
    musicTimer = null
  }
}