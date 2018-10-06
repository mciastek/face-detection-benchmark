import * as faceapi from 'face-api.js/dist/face-api'

import Adapter from './Adapter'

const MIN_CONFIDENCE = 0.4

const MTCNN_PARAMS = {
  minFaceSize: 200
}

class FaceApiAdapter extends Adapter {
  prepare () {
    return faceapi.loadMtcnnModel('/')
  }

  async process (source) {
    super.process()

    const { results } = await faceapi.nets.mtcnn.forwardWithStats(
      source,
      MTCNN_PARAMS
    )

    this.options.onUpdate()

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
