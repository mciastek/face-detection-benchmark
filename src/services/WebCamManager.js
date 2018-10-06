import { WebCamError } from 'utils/errors'

const getUserMedia = settings => {
  if (!navigator.getUserMedia || !navigator.mediaDevices) {
    throw new WebCamError('Web cam streaming is not supported!')
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
    const promise = new Promise((resolve, reject) => {
      this.videoEl.onplay = () => {
        resolve()
      }

      this.videoEl.onerror = error => {
        reject(new WebCamError(error.message))
      }
    })

    return getUserMedia({ video: {} })
      .then(this.handleStream)
      .then(() => promise)
      .catch(this.handleCaptureError)
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
    throw new WebCamError(error.message)
  }
}

export default WebCamManager
