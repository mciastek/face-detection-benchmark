import tracking from 'tracking'

import 'tracking/build/data/face-min.js'
import 'tracking/build/data/eye-min.js'
import 'tracking/build/data/mouth-min.js'

import { getMediaSize, drawRect } from './utils'

const CLASSIFIERS = ['face', 'eye', 'mouth']

const defaults = {
  edgesDensity: 0.1,
  initialScale: 4,
  scaleFactor: 1.25,
  stepSize: 1
}

class TrackingAdapter {
  constructor (overlayEl) {
    this.overlayEl = overlayEl
    this.overlayCtx = this.overlayEl.getContext('2d')

    this.pixelsCanvas = document.createElement('canvas')
    this.pixelsCanvasCtx = this.pixelsCanvas.getContext('2d')

    this.classifiers = []
  }

  prepare () {
    return new Promise((resolve, reject) => {
      try {
        this.classifiers = CLASSIFIERS.map(
          name => tracking.ViolaJones.classifiers[name]
        )
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  getPixels (source) {
    this.pixelsCanvasCtx.drawImage(
      source,
      0,
      0,
      this.pixelsCanvas.width,
      this.pixelsCanvas.height
    )

    const imageData = this.pixelsCanvasCtx.getImageData(
      0,
      0,
      this.pixelsCanvas.width,
      this.pixelsCanvas.height
    )

    return imageData.data
  }

  getResults (pixels) {
    return this.classifiers.map(classifier =>
      tracking.ViolaJones.detect(
        pixels,
        this.overlayWidth,
        this.overlayHeight,
        defaults.initialScale,
        defaults.scaleFactor,
        defaults.stepSize,
        defaults.edgesDensity,
        classifier
      )
    )
  }

  setOverlay (source) {
    const { width, height } = getMediaSize(source)
    this.overlayWidth = width
    this.overlayHeight = height
    this.overlayEl.width = this.overlayWidth
    this.overlayEl.height = this.overlayHeight

    this.pixelsCanvas.width = width
    this.pixelsCanvas.height = height
  }

  process (source) {
    const pixels = this.getPixels(source)
    const [face, eyes, mouth] = this.getResults(pixels)

    this.overlayCtx.clearRect(0, 0, this.overlayWidth, this.overlayHeight)

    face.forEach(coords => {
      drawRect(this.overlayCtx, coords)
    })

    // eyes.forEach(coords => {
    //   drawRect(this.overlayCtx, coords, '#00ff00')
    // })

    // mouth.forEach(coords => {
    //   drawRect(this.overlayCtx, coords, '#0000ff')
    // })
  }
}

export default TrackingAdapter
