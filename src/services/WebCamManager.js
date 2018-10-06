const getUserMedia = settings => {
  if (!navigator.getUserMedia || !navigator.mediaDevices) {
    throw new Error('Web cam streaming is not supported!')
  }

  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(settings)
  }

  return new Promise((resolve, reject) => {
    navigator.getUserMedia(settings, resolve, reject)
  })
}

class WebCamManager {
  constructor (videoEl) {
    this.videoEl = videoEl
    this.videoEl.addEventListener('loadedmetadata', this.handleVideoLoad)

    this.track = null
  }

  capture () {
    getUserMedia({ video: {} })
      .then(this.handleStream)
      .catch(this.handleCaptureError)

    return new Promise((resolve, reject) => {
      this.videoEl.onplay = () => {
        resolve()
      }

      this.videoEl.onerror = () => {
        reject(new Error('Failed'))
      }
    })
  }

  stop () {
    if (this.track) {
      this.track.stop()
    }
  }

  handleVideoLoad = () => {
    this.videoEl.play()
  }

  handleStream = stream => {
    this.videoEl.srcObject = stream
    this.track = stream.getTracks()[0]
  }

  handleCaptureError = error => {
    console.error(error)
  }
}

export default WebCamManager
