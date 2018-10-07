import Adapter from './Adapter'
import { drawRect } from './utils'

const getSourceScale = source => {
  if (!source.naturalWidth) {
    return 1
  }

  const originalSize = Math.max(source.width, source.naturalWidth)
  const resizedSize = Math.min(source.width, source.naturalWidth)

  return resizedSize / originalSize
}

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

    const scale = getSourceScale(source)
    const faces = await this.detector.detect(source)

    this.options.onUpdate()

    faces.forEach(face => {
      const { width, height, top, left } = face.boundingBox

      drawRect(
        this.overlayCtx,
        {
          x: left * scale,
          y: top * scale,
          width: width * scale,
          height: height * scale
        },
        this.drawOptions
      )
    })
  }
}

export default NativeFaceDetectorAdapter
