import Adapter from './Adapter'
import { drawRect } from './utils'

class NativeFaceDetectorAdapter extends Adapter {
  constructor (overlayEl, settings) {
    super(overlayEl, settings)

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
    super.process()

    const faces = await this.detector.detect(source)

    this.options.onUpdate()

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
