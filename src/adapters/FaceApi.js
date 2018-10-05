import * as faceapi from 'face-api.js/dist/face-api'

import { getMediaSize } from './utils'

const MIN_CONFIDENCE = 0.4

const MTCNN_PARAMS = {
  minFaceSize: 200
}

class FaceApiAdapter {
  constructor (overlayEl) {
    this.overlayEl = overlayEl
    this.overlayCtx = this.overlayEl.getContext('2d')
  }

  prepare () {
    return faceapi.loadMtcnnModel('/')
  }

  setOverlay (source) {
    const { width, height } = getMediaSize(source)
    this.overlayWidth = width
    this.overlayHeight = height
    this.overlayEl.width = this.overlayWidth
    this.overlayEl.height = this.overlayHeight
  }

  async process (source) {
    const { results } = await faceapi.nets.mtcnn.forwardWithStats(
      source,
      MTCNN_PARAMS
    )

    this.overlayCtx.clearRect(0, 0, this.overlayWidth, this.overlayHeight)

    if (results) {
      results.forEach(({ faceDetection, faceLandmarks }) => {
        if (faceDetection.score < MIN_CONFIDENCE) {
          return
        }

        faceapi.drawDetection(
          this.overlayEl,
          faceDetection.forSize(this.overlayWidth, this.overlayHeight)
        )
        faceapi.drawLandmarks(
          this.overlayEl,
          faceLandmarks.forSize(this.overlayWidth, this.overlayHeight),
          {
            lineWidth: 4,
            color: 'red'
          }
        )
      })
    }
  }
}

export default FaceApiAdapter
