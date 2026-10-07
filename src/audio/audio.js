let audioContext = null

export function initAudio() {
  if (audioContext) {
    return audioContext
  }

  audioContext = new AudioContext()

  return audioContext
}

export function getAudioContext() {
  return audioContext
}

export function resumeAudio() {
  if (!audioContext) {
    return
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}