import Adapter from './Adapter'
import { drawRect } from './utils'

class NativeFaceDetectorAdapter extends Adapter {
  constructor (overlayEl) {
    super(overlayEl)

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
