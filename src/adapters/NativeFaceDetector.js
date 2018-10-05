import { getMediaSize, drawRect } from './utils'

class NativeFaceDetectorAdapter {
  constructor (overlayEl) {
    this.overlayEl = overlayEl
    this.overlayCtx = this.overlayEl.getContext('2d')

    this.detector = null
  }

  prepare () {
    return new Promise((resolve, reject) => {
      try {
        this.detector = new window.FaceDetector()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  setOverlay (source) {
    const { width, height } = getMediaSize(source)
    this.overlayWidth = width
    this.overlayHeight = height
    this.overlayEl.width = this.overlayWidth
    this.overlayEl.height = this.overlayHeight
  }

  async process (source) {
    const faces = await this.detector.detect(source)

    this.overlayCtx.clearRect(0, 0, this.overlayWidth, this.overlayHeight)

    faces.forEach(face => {
      const { width, height, top, left } = face.boundingBox

      drawRect(this.overlayCtx, {
        x: left,
        y: top,
        width,
        height
      })
    })
  }
}

export default NativeFaceDetectorAdapter
