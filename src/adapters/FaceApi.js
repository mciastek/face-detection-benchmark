import * as faceapi from 'face-api.js/dist/face-api'

import Adapter from './Adapter'

const MIN_CONFIDENCE = 0.4

const MTCNN_PARAMS = {
  minFaceSize: 200
}

const modelFetcher = () => {
  let loaded = false

  return () => {
    if (!loaded) {
      return faceapi.loadMtcnnModel('/')
        .then(() => {
          loaded = true

          return loaded
        })
    }

    return Promise.resolve()
  }
}

const fetchModel = modelFetcher()

class FaceApiAdapter extends Adapter {
  prepare () {
    return fetchModel()
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
          faceDetection.forSize(this.overlayWidth, this.overlayHeight),
          {
            ...this.drawOptions,
            withScore: false
          }
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
