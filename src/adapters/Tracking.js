import tracking from 'tracking'

import 'tracking/build/data/face-min.js'

import Adapter from './Adapter'
import { drawRect } from './utils'

const CLASSIFIERS = ['face']

const defaults = {
  edgesDensity: 0.1,
  initialScale: 4,
  scaleFactor: 1.25,
  stepSize: 1.5
}

const MAX_WIDTH = 320

class TrackingAdapter extends Adapter {
  constructor (overlayEl, settings) {
    super(overlayEl, settings)

    this.pixelsCanvas = document.createElement('canvas')
    this.pixelsCanvasCtx = this.pixelsCanvas.getContext('2d')

    this.classifiers = []
    this.scale = 1
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
        this.pixelsCanvas.width,
        this.pixelsCanvas.height,
        defaults.initialScale,
        defaults.scaleFactor,
        defaults.stepSize,
        defaults.edgesDensity,
        classifier
      )
    )
  }

  setOverlay (source) {
    super.setOverlay(source)

    this.scale = MAX_WIDTH / this.overlayWidth

    this.pixelsCanvas.width = this.overlayWidth * this.scale
    this.pixelsCanvas.height = this.overlayHeight * this.scale
  }

  process (source) {
    super.process()

    const pixels = this.getPixels(source)
    const [face] = this.getResults(pixels)

    this.options.onUpdate()

    face.forEach(coords => {
      drawRect(
        this.overlayCtx,
        {
          x: coords.x / this.scale,
          y: coords.y / this.scale,
          width: coords.width / this.scale,
          height: coords.height / this.scale
        },
        this.drawOptions
      )
    })
  }
}

export default TrackingAdapter
