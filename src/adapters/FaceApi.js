import * as faceapi from 'face-api.js/dist/face-api'

const MIN_CONFIDENCE = 0.4

const MTCNN_PARAMS = {
  minFaceSize: 200
}

class FaceApiAdapter {
  constructor (videoEl) {
    this.videoEl = videoEl
  }

  prepare () {
    return faceapi.loadMtcnnModel('/')
  }

  async process () {
    const { width, height } = faceapi.getMediaDimensions(this.videoEl)

    const canvas = document.getElementById('overlay')
    canvas.width = width
    canvas.height = height

    const { results, stats } = await faceapi.nets.mtcnn.forwardWithStats(
      this.videoEl,
      MTCNN_PARAMS
    )

    if (results) {
      results.forEach(({ faceDetection, faceLandmarks }) => {
        if (faceDetection.score < MIN_CONFIDENCE) {
          return
        }

        faceapi.drawDetection(canvas, faceDetection.forSize(width, height))
        faceapi.drawLandmarks(canvas, faceLandmarks.forSize(width, height), {
          lineWidth: 4,
          color: 'red'
        })
      })
    }
  }
}

export default FaceApiAdapter
